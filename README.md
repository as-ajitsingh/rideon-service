# RideOn Service

Builds on NestJs and MongoDB

## Todo:
- getAllRequest for employee and admin [x]
- getAllRequest to return employee name and other details too for admin (auth0 api) [x]
- getall vendors [x]
- change request status [x]
- server-side validation on create request
- vendor endpoint
  - get all vendors [x]
  - bulkUploadVendors [x]
  - excel sheet validation
  - ignore duplicate entries
- twillio integration
- email integration




## Dev Notes
- To get into mongo docker `docker exec -it 661ad791f4d9 bash`, open mongo terminal inside docker `mongosh -u root -p rootpassword`.