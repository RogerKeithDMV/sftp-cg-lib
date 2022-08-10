# Library for SFTP connections in OIH

### This library has different methods depending of the flag received in the request

## **GETLISTFILES**
- Get the list of all directories and files inside the specified path.
## **GETFILE**
- Get the specified file in a base64 format.
## **SAVEFILE**
- Save a string in base64 as a new file with the asigned name in teh request.
## **RENAMEFILE**
- Rename the file specified with an old name an assign a new name.
## **DELETEFILE**
- Delete the specified file.
## **CREATEDIRECTORY**
- Create a new directory, it can be a directory and subdirectories.
## **DELETEDIRECTORY**
- Delete a directory, if it contains subdirectories and file inside it, all of them will be also deleted.