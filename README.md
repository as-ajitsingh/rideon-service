# RideOn Service
Builds on NestJs and MongoDB

## Features
- Cab Request
  - Employee can create cab request
  - Employee can view their own cab request
  - Admin can view cab requests of all employees
  - Admin can approve cab request and assign vendors
  - Admin can reject cab request and supply rejection message
- Vendors
  - Admin can view all vendors
  - Admin can bulk upload vendors via excel sheet (file should be xlxs format, with one sheet having first coloum as vendors name and second as contactNumber, first row is ignored for headers)
- Authentication
  - Requires access token from auth0 to access api
  - By default Employee role is given
  - When api is called first time via user - user details (name, email, profile picture are extracted from auth0 and saved in db)

## Todo:
- server-side validation on create request
- vendor endpoint
  - excel sheet validation
  - ignore duplicate entries
- twillio integration
- email integration




## Dev Notes
- To get into mongo docker `docker exec -it <container-id> bash`, open mongo terminal inside docker `mongosh -u root -p rootpassword`.