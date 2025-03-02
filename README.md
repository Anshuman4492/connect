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
- Merge both of above to: userId is id of person, who we want to send request
- POST /request/send/:status/:userId (Status can be either like or pass)


- POST /request/review/accecpted/:requestId 
- POST /request/review/rejected/:requestId
- POST /request/review/block/:requestId (Block)
- Merge both of above to: userId is id of person, who we want to review request
- POST /request/review/:status/:requestId (Status can be either accepted, rejected or blocked)

## User Router
- GET /user/requests
- GET /user/connections
- GET /user/feed - Gets profile of other users on platform

