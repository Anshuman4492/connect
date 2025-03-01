# connect
A social media platform

# API List

## Auth Router
- POST /signup
- POST /login
- POST /logout
- POST /forgotpassword

## Profile Router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password -> Change password

## Request Router
- POST /request/send/like/:userId (Send)
- POST /request/send/pass/:userId (Ignore)
- POST /request/send/block/:userId (Block)
- POST /request/review/accecpted/:userId 
- POST /request/review/rejected/:userId 

## User Router
- GET /user/feed - Gets profile of other users on platform
- GET /user/connections
- GET /user/requests

