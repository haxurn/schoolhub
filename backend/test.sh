#!/bin/bash

# URLs of the files to be downloaded
RESUME_URL="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
PERSONAL_DOCS_URL="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
JOINING_LETTER_URL="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
IMAGE_URL="https://via.placeholder.com/150.jpg"

# Download the files
curl -o resume.pdf $RESUME_URL
curl -o personal_docs.pdf $PERSONAL_DOCS_URL
curl -o joining_letter.pdf $JOINING_LETTER_URL
curl -o image.jpg $IMAGE_URL

# Upload the files
curl -X 'POST' \
  'http://192.168.8.19:5000/api/auth/register-finance' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbmlzdHJhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMzMDkxNjExLCJleHAiOjE3MzMwOTUyMTF9.8idlO8Ha2vrLlKQYN75zUdgh-GRwU8UcoCXs4lnDHGc' \
  -H 'Content-Type: multipart/form-data' \
  -F 'lastName=Doe' \
  -F 'gender=Male' \
  -F 'fathersName=Richard' \
  -F 'youtube=youtube.com/random' \
  -F 'epfNumber=EPF098765' \
  -F 'bloodGroup=O+' \
  -F 'workLocation=Downtown' \
  -F 'maritalStatus=Married' \
  -F 'panNumber=ABCDE1234F' \
  -F 'facebook=facebook.com/random' \
  -F 'permanentAddress=Downtown' \
  -F 'primaryContactNumber=0987654321' \
  -F 'bankName=Bank of Random' \
  -F 'casualLeaves=10' \
  -F 'previousWork=Manager' \
  -F 'languagesKnown=English' \
  -F 'maternityLeaves=0' \
  -F 'previousWorkAddress=457, Bole' \
  -F 'contractType=Permanent' \
  -F 'resume=@resume.pdf;type=application/pdf' \
  -F 'medicalLeaves=0' \
  -F 'qualification=MBA' \
  -F 'previousWorkPhoneNumber=0987654321' \
  -F 'dateOfLeaving=2025-12-01' \
  -F 'workShift=Morning' \
  -F 'instagram=instagram.com/random' \
  -F 'dateOfJoining=2024-12-01' \
  -F 'address=4545, Addis Ababa' \
  -F 'accountNumber=1234567890' \
  -F 'emailAddress=johndoe@example.com' \
  -F 'accountName=John Doe' \
  -F 'basicSalary=500' \
  -F 'dateOfBirth=1998-12-01' \
  -F 'sickLeaves=3' \
  -F 'ifscCode=IFSC12345' \
  -F 'personalDocs=@personal_docs.pdf;type=application/pdf' \
  -F 'mothersName=Jane' \
  -F 'image=@image.jpg;type=image/jpeg' \
  -F 'firstName=John' \
  -F 'confirmPassword=123456789' \
  -F 'password=123456789' \
  -F 'workExperience=5' \
  -F 'twitterUrl=twitter.com/random' \
  -F 'joiningLetter=@joining_letter.pdf;type=application/pdf' \
  -F 'linkedin=linkedin.com/random'
