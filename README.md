# Restaurant Forum

This is a restaurant forum where you can review restaurants, leave comments, and add them to your favorite list.

### Key features
* User can create his/her own account
* User can review restaurants data which includes basic info, comments, number of likes, etc..
* User can leave comments
* User can add restaurant to favorite list or liked list
* User can view his/her own profile and activities
* User can follow other users
* Admin can edit user's role
* Admin can create, edit, delete restaurant
* Admin can create, edit, delete category

![Imgur](https://i.imgur.com/vufTBZU.png)

![Imgur](https://i.imgur.com/0YGPPve.png)

![Imgur](https://i.imgur.com/AlZGpqC.png)

### Prerequisite
* Node.js 
* MySQL

### Setup

1. clone repo
```
$ git clone git@github.com:tsungtingdu/node_restaurant_forum.git
```

2. go to project folder
```
$ cd node_restaurant_forum
```

3. install packages and dependency
```
$ npm i
```

4. create .env file with following variables
```
JWT_SECRET=xxxx
IMGUR_CLIENT_ID=xxxx
```

5. setup database
```
drop database if exists forum;
create database forum;
use forum;
```

6. run migration
```
$ npx sequelize db:migrate
```

7. start the server
```
$ npm run dev
```

***
### Authors
[Jacs](https://github.com/jacs0110) / [tsungtingdu](https://github.com/tsungtingdu) (Tim)

Self-taught and trained in software development knowledge and skills, I am passionate about creating changes through technology.

You can find more about me here:
* [Medium](https://medium.com/tds-note)
* [LinkedIn](https://www.linkedin.com/in/tsung-ting-tu/)
* [Teaching Assistant at ALPHA Camp](https://lighthouse.alphacamp.co/users/3247/ta_profile)