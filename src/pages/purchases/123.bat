@echo off
setlocal

set FILES=PurchaseList.tsx PurchaseOrder.tsx PurchaseReturn.tsx 

for %%f in (%FILES%) do (
  if not exist %%f (
    type nul > %%f
    echo Created: %%f
  ) else (
    echo File already exists: %%f
  )
)