# letsEndorse
# letsEndorse



########## TOKEN on headers with key    URL--> {uploadData, approve-blog, approve-admin}
{
authorization - 'bearer tokenID'
}

############## superAdminCredential
{
username: 'superadmin',
password: 'superadmin'
}



###################################### for registration
POST - localhost:3000/user/registration
#keys {
username,
password,
role - 'user/admin'
}


###################################### for login
POST - localhost:3000/user/login
#keys {
username,
password
}


############################### upload blog data
POST - localhost:3000/user/uploadData
#keys {
title,
content,
author_name,
image ---> 'uploadPics'
}


############################## Approve blog
PUT - localhost:3000/user/approve-blog
#keys {
blogId,
isApproved: true
}


############################## Approve Admin
PUT - localhost:3000/user/approve-admin
#keys {
adminId,
isAdmin: true
}


################################## GET Approved Blog List
GET - localhost:3000/user/blog-list


################################# Blog details
GET - localhost:3000/user/getlist
#keys {
blogId
}
# letsEndorse
# letsEndorseAssign
# letsEndorseAssign
