# Backend for Social_Media

This folder contains the server-side code for the social media application, built using Node.js and Express.

## Features
- RESTful API for frontend integration
- JWT-based authentication
- MongoDB for database management

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (locally installed or a MongoDB Atlas connection string)

### Steps
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CORS_ORIGIN=your_cors_origin
     ```
4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/v1/users`      | Fetch all users          |
| POST   | `/api/v1/auth/login` | Login user               |
| POST   | `/api/v1/videos`     | Create a new video       |
| GET    | `/api/v1/tweets`     | Fetch tweets             |

## Routes

### Comment Routes
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/v1/comments/:videoId` | Get comments for a video |
| POST   | `/api/v1/comments/:videoId` | Add a comment to a video |
| GET    | `/api/v1/comments/t/:tweetId` | Get comments for a tweet |
| POST   | `/api/v1/comments/t/:tweetId` | Add a comment to a tweet |
| DELETE | `/api/v1/comments/c/:commentId` | Delete a comment |
| PATCH  | `/api/v1/comments/c/:commentId` | Update a comment |

### Dashboard Routes
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/v1/dashboard/stats/:channelId` | Get channel stats |
| GET    | `/api/v1/dashboard/videos/:channelId` | Get all videos uploaded by the channel |

### Healthcheck Route
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/v1/healthcheck` | Check the health of the server |

### Like Routes
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | `/api/v1/likes/toggle/v/:videoId` | Toggle like on video |
| POST   | `/api/v1/likes/toggle/c/:commentId` | Toggle like on comment |
| POST   | `/api/v1/likes/toggle/t/:tweetId` | Toggle like on tweet |
| GET    | `/api/v1/likes/videos` | Get all liked videos |
| GET    | `/api/v1/likes/v/:videoId` | Check if video is liked |
| GET    | `/api/v1/likes/c/:commentId` | Check if comment is liked |
| GET    | `/api/v1/likes/t/:tweetId` | Check if tweet is liked |

### Playlist Routes
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | `/api/v1/playlists` | Create a new playlist |
| GET    | `/api/v1/playlists/:playlistId` | Get a playlist by ID |
| PATCH  | `/api/v1/playlists/:playlistId` | Update a playlist |
| DELETE | `/api/v1/playlists/:playlistId` | Delete a playlist |
| PATCH  | `/api/v1/playlists/add/:videoId/:playlistId` | Add a video to a playlist |
| PATCH  | `/api/v1/playlists/remove/:videoId/:playlistId` | Remove a video from a playlist |
| GET    | `/api/v1/playlists/user/:userId` | Get all playlists of a user |

### Subscription Routes
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | `/api/v1/subscriptions/c/:channelId` | Toggle subscription |
| GET    | `/api/v1/subscriptions/c/:channelId` | Get subscriber list of a channel |
| GET    | `/api/v1/subscriptions/subscribed` | Get subscribed channels of a user |

### Tweet Routes
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | `/api/v1/tweets`     | Create a tweet           |
| GET    | `/api/v1/tweets/user/:userId` | Get user tweets |
| PATCH  | `/api/v1/tweets/:tweetId` | Update a tweet |
| DELETE | `/api/v1/tweets/:tweetId` | Delete a tweet |
| GET    | `/api/v1/tweets/:tweetId` | Get a tweet by ID |

### User Routes
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | `/api/v1/users/register` | Register a new user |
| POST   | `/api/v1/users/login` | Login user |
| POST   | `/api/v1/users/logout` | Logout user |
| POST   | `/api/v1/users/refresh-token` | Refresh access token |
| GET    | `/api/v1/users/get-password` | Get current user's password |
| POST   | `/api/v1/users/change-password` | Change password |
| GET    | `/api/v1/users/current-user` | Get current user |
| PATCH  | `/api/v1/users/update-profile` | Update account details |
| PATCH  | `/api/v1/users/update-avatar` | Update user avatar |
| PATCH  | `/api/v1/users/update-cover-image` | Update user cover image |
| GET    | `/api/v1/users/c/:username` | Get user channel |
| GET    | `/api/v1/users/history` | Get watch history |

## File Structure
- **`routes`**: Contains route handlers for various endpoints
- **`models`**: Mongoose schemas for MongoDB
- **`controllers`**: Business logic for API endpoints
- **`middleware`**: Authentication and validation middleware

## Available Scripts
- `npm start`: Starts the server in production mode
- `npm run dev`: Starts the server in development mode
- `npm test`: Runs tests

For issues, contact [GitHub Profile Link](https://github.com/Chirag1678).