# PetAndPals Backend API

This is the backend api for pet and pals project. This is responsible for managing the database data.

## Tools Required

- [Intellij IDE](https://www.jetbrains.com/idea/download/?section=windows)
- [Xampp](https://www.apachefriends.org/download.html)

## Database Setup

First open xampp and start the mysql

Then open your powershell or cmd and type the following

```bash
C:\xampp\mysql\bin\mysql.exe -u root
```

This will open up the mysql prompt. After you see the mysql prompt type the following

```sql
CREATE USER 'petandpals'@'localhost' IDENTIFIED BY 'petandpals';
```

This following sql statement will create a new user 'petandpals' with the password 'petandpals'.
Now i want you to exit the mysql prompt. You can do this by pressing `Ctrl + c` multiple types until you see that you exited or by typing `exit` in the prompt.
After you exit i want you to enter mysql again but this time logged in as our newly created user.

```bash
C:\xampp\mysql\bin\mysql.exe -u petandpals -p
```

Enter the password `petandpals`. Now that you have logged in as `petandpals` You need to create the database.
To do this type:

```sql
create database petandpals;
```

And your done with the database setup!.

## Running The Backend API

All you have to do is open this folder on intellij. intellij should setup the project and all you have to do is run the backend api.
