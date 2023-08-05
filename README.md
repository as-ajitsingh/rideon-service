# RideOn Service
Builds on NestJs and MongoDB

## Features
- Cab Request
  - Employee can create cab request, a mail will be sent to all admins
  - Employee can view their own cab requests with paginations (provide `page-number` and `limit` as query params)
  - Admin can view cab requests of all employees with paginations (provide `page-number` and `limit` as query params)
  - Admin can approve cab request and assign vendors, a sms will be sent to vendor's constact number giving details about request
  - Admin can reject cab request and supply rejection message
  - Admin can export all requests as excel within a time range grouped by status
- Vendors
  - Admin can view all vendors with paginations (provide `page-number` and `limit` as query params)`
  - Admin can bulk upload vendors via excel sheet (file should be xlxs format, with one sheet having first coloum as vendors name and second as contactNumber, first row is ignored for headers)
- Authentication
  - Requires access token from auth0 to access api
  - By default Employee role is given
  - When api is called first time via user - user details (name, email, profile picture are extracted from auth0 and saved in db)

## Todo:
- server-side validation on create request
- send request approval or rejection to employee
- vendor endpoint
  - excel sheet validation
  - ignore duplicate entries




## Dev Notes
- To get into mongo docker `docker exec -it <container-id> bash`, open mongo terminal inside docker `mongosh -u root -p rootpassword`.