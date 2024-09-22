# Project Name: Todo List API

## Description
This project is a backend JavaScript API for a to-do list application. It offers endpoints for managing tasks, including the ability to create, update, and delete tasks. The API is designed for use by a frontend application, enabling it to interact seamlessly with the to-do list data.

## Installation

To install the project, follow these steps:

1. Clone the repository: `git clone https://github.com/shubhamkourav/todo-list-api.git`
2. Navigate to the project directory: `cd todo-list-api`
3. Install dependencies: `npm install`

## Usage

To use the project, follow these steps:

1. Run the application: `npm run dev`
2. Interact with the application as per the instructions provided.


## Features

### Authentication

#### 1.User Registration:

- Handles user registration via POST `/auth/register`.
- Checks if the email already exists in the database.
- Saves the new user to MongoDB if the email is unique.
- Returns a success message on successful registration or an error message on failure.

#### 2. User Login:

- Handles user login via POST `/auth/login`.
- Validates the email and password combination.
- Generates both an access token and a refresh token upon successful login.
- Returns the generated accessToken and refreshToken.

#### 4. Access and Refresh Token Generation:

- Access tokens are generated using the generateAccessToken method.
- Refresh tokens are generated using the generateRefreshToken method.
- Tokens are stored in Redis for fast retrieval and validation.

#### 5. Refresh Token Verification and Regeneration:

- Handles token refresh via POST `/auth/refresh-token`.
- Verifies the provided refresh token by comparing it with the one stored in Redis.
- If the refresh token is valid, a new access token and refresh token are generated and returned.
- Invalid refresh tokens return a 403 status code.

#### 6. Token Storage and Validation:

- Refresh tokens are stored in Redis with the format `refreshToken:<userId>`.
- The system checks Redis for the valid refresh token on each request to ensure token integrity.

#### 7. User Logout:

- Handles user logout via POST `/auth/logout`.
Verifies the refresh token provided during logout.
Deletes the refresh token from Redis and optionally from MongoDB (if stored).
Returns a success message upon successful logout.

####  8.Error Handling:

- Errors during registration, login, refresh token operations, or logout are caught and handled gracefully.
- Responses include appropriate status codes (400, 401, 403, 500) and error messages.


### TODO

#### 1. Create Todo:

-  Handles creating a new todo via POST `/todo`.
- Accepts todo details in the request body and associates the todo with the authenticated user (req.user._id).
- Saves the new todo item in the database.
- Returns the created todo with a `201` status code or an error message on failure.

#### 2. Read Single Todo:

- Handles fetching a single todo by its ID via GET `/todos/:id`.
- Retrieves the todo item from the database and populates the user information (only the `name` field).
- If the todo is not found, returns a `404` status code with an appropriate message.
- Returns the todo details or an error message on failure.

#### 3. Update Todo:

- Handles updating a specific todo by its ID via `PUT /todos/:id`.
- Accepts the updated todo data in the request body and updates the todo in the database.
- Returns the updated todo item with populated user details.
- If the todo is not found, returns a `404` status code with a message.
- Returns the updated todo or an error message on failure.

#### 4. Delete Todo:

- Handles deleting a todo by its ID via `DELETE /todos/:id`.
- Deletes the todo item from the database.
- If the todo is not found, returns a `404` status code with a message.
- Returns the deleted todo or an error message on failure.

#### 5.Get All Todos with Pagination, Sorting, and Searching:

- Handles fetching all todos for a specific user or general todos via `GET /todos`.
- Supports **pagination** with `page` and `limit` query parameters (default: page 1, limit 10).
- Supports **sorting** on any field (default: sorted by `createdAt`, ascending).
- Supports **searching** by the todo title using the `search` query parameter (case-insensitive search with regex).
- Returns a paginated response including the total count of todos, current page, limit, total pages, and the actual todo data.
- Returns an error message on failure.

#### Example Query Parameters for Pagination, Sorting, and Searching:
- **Pagination**:
    - `page=2`: Fetch the second page of todos.
    - `limit=5`: Limit the response to 5 todos per page.

- **Sorting**:
    - `sort=title`: Sort todos by the title field.
    - `order=desc`: Sort todos in descending order.

- **Searching**:
    - `search=groceries`: Search todos with titles that contain "groceries".



## Contributing

Contributions are welcome! To contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-new-feature`
3. Make your changes and commit them: `git commit -am 'Add my new feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project URL

[Todo List API](https://roadmap.sh/projects/todo-list-api)
