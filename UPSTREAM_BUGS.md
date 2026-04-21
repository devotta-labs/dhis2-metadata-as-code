# DHIS2 master bugs encountered while building this demo

Both bugs reproduce on the `master` branch of
[dhis2/dhis2-core](https://github.com/dhis2/dhis2-core). Line numbers refer to
the snapshot used during development. Both are hit during
`POST /api/metadata` when importing fresh (new-to-the-database) objects with
`identifier=CODE`.

---

## 1. `CategoryCombo` import crashes with `UID.of(null)` when the referenced Categories are also new

**Description.** In the bundle validation phase,
`CategoryComboObjectBundleHook.validate(combo, ...)` calls
`categoryService.validate(combo)`, which at
`DefaultCategoryService.validate(CategoryCombo)` iterates
`combo.getCategories()` and calls `validate(category)` on each entry.

When a CategoryCombo is imported alongside new Categories, the entries in
`combo.getCategories()` are shallow Jackson stubs constructed from the
code-only refs in the JSON (`categoryCombo.categories[].code`). These stubs
have `getCategoryOptions().size() == 0`, so `validate(Category)` falls through
to the `actualOptions == 0` branch at `DefaultCategoryService.java:97`:

```java
if (actualOptions == 0)
  actualOptions = categoryOptionStore.getCategoryOptionsCount(UID.of(category.getUid()));
```

For a transient Category whose UID has not been assigned yet,
`category.getUid()` is `null`, and `UID.of(null)` throws
`IllegalArgumentException: UID must be an alphanumeric string of 11 characters starting with a letter, but was: null`.
The client sees a `400 Bad Request` with that exact message.

**Source.**
- `dhis-2/dhis-services/dhis-service-core/src/main/java/org/hisp/dhis/category/DefaultCategoryService.java:97`
  — `UID.of(null)` crash inside `validate(Category)`
- `dhis-2/dhis-services/dhis-service-core/src/main/java/org/hisp/dhis/category/DefaultCategoryService.java:334`
  — caller loop in `validate(CategoryCombo)`
- `dhis-2/dhis-services/dhis-service-dxf2/src/main/java/org/hisp/dhis/dxf2/metadata/objectbundle/hooks/CategoryComboObjectBundleHook.java:72`
  — entry point from the bundle hook

**Steps to reproduce.**
1. Start a fresh master DHIS2 instance.
2. `POST /api/metadata?importStrategy=CREATE_AND_UPDATE&identifier=CODE&atomicMode=ALL&importMode=VALIDATE`
   with a body containing one new CategoryCombo that references two new
   Categories by code only:
   ```json
   {
     "categories": [{ "code": "SEX", "name": "Sex", "shortName": "Sex",
                      "dataDimensionType": "DISAGGREGATION",
                      "categoryOptions": [{ "code": "MALE" }, { "code": "FEMALE" }] }],
     "categoryCombos": [{ "code": "SEX_COMBO", "name": "Sex combo",
                          "dataDimensionType": "DISAGGREGATION",
                          "categories": [{ "code": "SEX" }] }],
     "categoryOptions": [{ "code": "MALE", "name": "Male", "shortName": "Male" },
                         { "code": "FEMALE", "name": "Female", "shortName": "Female" }]
   }
   ```
3. Observe `400 Bad Request` with
   `"message": "UID must be an alphanumeric string of 11 characters starting with a letter, but was: null"`.

**Likely fix.** Either null-guard the fallback in
`DefaultCategoryService.validate(Category)`, or populate the transient
Category's `categoryOptions` during preheat so the fallback branch is never
taken when the Category is part of the current bundle.

**Client-side workaround.** Always emit a DHIS2-shaped `id` on every
reference (not just `code`). The Jackson-parsed stub then has a valid UID and
the fallback path queries the DB harmlessly.

---

## 2. `DataElement` import NPEs on every new DataElement — missing `isPersisted` guard in value-type-change validation

**Description.**
`DataElementObjectBundleHook.valueTypeChangeValidation` is meant to block
changing a DataElement's `valueType` when DataValues exist. It loads the
existing DataElement from preheat and dereferences it without a null check:

```java
DataElement dePreheat = bundle.getPreheat().get(PreheatIdentifier.UID, dataElement);
ValueType existingValueType = dePreheat.getValueType();   // NPE for new DEs
```

For a new DataElement there is no preheat match, so `dePreheat` is `null` and
line 99 throws
`NullPointerException: Cannot invoke "org.hisp.dhis.dataelement.DataElement.getValueType()" because "dePreheat" is null`.
The client receives a `500 Internal Server Error`.

The hook is missing the `if (bundle.isPersisted(...))` gate that the
sibling `CategoryComboObjectBundleHook.validate` uses around its update-only
check (`CategoryComboObjectBundleHook.java:55`). Value-type-change validation
is only meaningful on updates, so the guard is the right pattern.

**Source.**
- `dhis-2/dhis-services/dhis-service-dxf2/src/main/java/org/hisp/dhis/dxf2/metadata/objectbundle/hooks/DataElementObjectBundleHook.java:93-99`

**Steps to reproduce.**
1. Start a fresh master DHIS2 instance.
2. `POST /api/metadata?importStrategy=CREATE_AND_UPDATE&identifier=CODE`
   with a body containing any new DataElement:
   ```json
   {
     "dataElements": [{
       "code": "MAL_CASES", "name": "Malaria cases", "shortName": "Malaria cases",
       "valueType": "NUMBER", "aggregationType": "SUM", "domainType": "AGGREGATE"
     }]
   }
   ```
3. Observe `500 Internal Server Error` with
   `"message": "Cannot invoke \"org.hisp.dhis.dataelement.DataElement.getValueType()\" because \"dePreheat\" is null"`.

**Likely fix.** Wrap the body of `valueTypeChangeValidation` in
`if (bundle.isPersisted(dataElement)) { ... }`, mirroring
`CategoryComboObjectBundleHook.validate`. Alternatively, null-check
`dePreheat` before calling `getValueType()`.

**Client-side workaround.** Add `skipValidation=true` to the import query
string. This skips the bundle hook layer; schema, reference, and sharing
checks still run.
