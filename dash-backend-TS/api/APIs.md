# User APIs

## Register User

Endpoint: `/api/user`

Method: `POST`

Request Body:

```json
{
  "name": "john doe",
  "phone": "johndoe@mail.com",
  "password": "example@123456",
  "type": "asha",
  "location": {
    "latitude": 29.834268,
    "longitude": 79.772007
  }
}
```

Response:

```json
{
  "user": {
    "name": "John Doe",
    "phone": "johnDoe@mail.com",
    "password": "$2a$10$otcwhf...",
    "type": "asha",
    "location": { "latitude": 29.834268, "longitude": 79.772007 },
    "lastActive": "2025-01-09T13:24:40.379Z",
    "stocks": [],
    "payments": [],
    "_id": "677fce187dd2139ba8807f26",
    "createdAt": "2025-01-09T13:24:40.388Z",
    "updatedAt": "2025-01-09T13:24:40.388Z",
    "__v": 0
  },
  "token": "eyJhbGciO..."
}
```

## Get User Info

Endpoint: `/api/user`

Method: `GET`

Request Headers:

- Authorization: `Bearer <token>`
- Content-Type: `application/json`

```json
{
  "name": "john doe",
  "phone": "johndoe@example.com",
  "password": "example@123456",
  "type": "asha",
  "location": {
    "latitude": 29.834268,
    "longitude": 79.772007
  }
}
```

Response:

```json
{
  "_id": "677fce187dd2139ba8807f26",
  "name": "John Doe",
  "phone": "johnDoe@mail.com",
  "password": "$2a$10$otcwhfUzF6umKKGuX.vdVexWB9qgx18Gbk/as...",
  "type": "asha",
  "location": {
    "latitude": 29.834268,
    "longitude": 79.772007
  },
  "lastActive": "2025-01-09T13:24:40.379Z",
  "stocks": [],
  "payments": [],
  "createdAt": "2025-01-09T13:24:40.388Z",
  "updatedAt": "2025-01-09T13:24:40.388Z",
  "__v": 0
}
```

## Login User

Endpoint: `/api/user/login`

Method: `POST`

Request Body:

```json
{
  "phone": "johndoe@example.com",
  "password": "example@123456"
}
```

Response:

```json
{
  "user": {
    "_id": "677fce187dd2139ba8807f26",
    "name": "John Doe",
    "phone": "johnDoe@mail.com",
    "password": "$2a$10$otcwhfU...",
    "type": "asha",
    "location": { "latitude": 29.834268, "longitude": 79.772007 },
    "lastActive": "2025-01-09T13:24:40.379Z",
    "stocks": [],
    "payments": [],
    "createdAt": "2025-01-09T13:24:40.388Z",
    "updatedAt": "2025-01-09T13:24:40.388Z",
    "__v": 0
  },
  "token": "eyJhbGciOiJ..."
}
```

---

# Stock APIs

## Get Stocks

### Endpoint: `/api/stocks`

#### Method: `GET`

#### Query Parameters:

- **type** (optional): The type of stock to retrieve. Can be one of the following:
  - `available`: Retrieve stocks that are available.
  - `unavailable`: Retrieve stocks that are unavailable.
  - `near`: Retrieve stocks near a specific location (use with geospatial queries).
  
#### Request Headers:
- **Authorization**: `Bearer <token>` (Token generated during user login)
- **Content-Type**: `application/json`

#### Response:

##### Success (200):

If `type` is provided:

```json
{
  "stocks": [
    {
      "_id": "12345",
      "name": "Stock 1",
      "status": "available",
      "location": {
        "latitude": 29.834268,
        "longitude": 79.772007
      },
      "createdAt": "2025-01-09T13:24:40.379Z",
      "updatedAt": "2025-01-09T13:24:40.379Z"
    },
    {
      "_id": "67890",
      "name": "Stock 2",
      "status": "unavailable",
      "location": {
        "latitude": 29.834268,
        "longitude": 79.772007
      },
      "createdAt": "2025-01-09T13:24:40.379Z",
      "updatedAt": "2025-01-09T13:24:40.379Z"
    }
  ]
}
```

If no `type` is provided (default to retrieving all stocks):

```json
{
  "stocks": [
    {
      "_id": "12345",
      "name": "Stock 1",
      "status": "available",
      "location": {
        "latitude": 29.834268,
        "longitude": 79.772007
      },
      "createdAt": "2025-01-09T13:24:40.379Z",
      "updatedAt": "2025-01-09T13:24:40.379Z"
    },
    {
      "_id": "67890",
      "name": "Stock 2",
      "status": "unavailable",
      "location": {
        "latitude": 29.834268,
        "longitude": 79.772007
      },
      "createdAt": "2025-01-09T13:24:40.379Z",
      "updatedAt": "2025-01-09T13:24:40.379Z"
    }
  ]
}
```

##### Error (400 / 500):

```json
{
  "error": "Invalid type parameter, should be 'available', 'unavailable', or 'near'"
}
```

---

## Create Stock

### Endpoint: `/api/stocks`

#### Method: `POST`

#### Request Headers:
- **Authorization**: `Bearer <token>` (Token generated during user login)
- **Content-Type**: `application/json`

#### Request Body:

```json
{
  "name": "Stock 1",
  "status": "available",
  "location": {
    "latitude": 29.834268,
    "longitude": 79.772007
  }
}
```

#### Response:

##### Success (201):

```json
{
  "stock": {
    "_id": "12345",
    "name": "Stock 1",
    "status": "available",
    "location": {
      "latitude": 29.834268,
      "longitude": 79.772007
    },
    "createdAt": "2025-01-09T13:24:40.379Z",
    "updatedAt": "2025-01-09T13:24:40.379Z"
  }
}
```

##### Error (400 / 500):

```json
{
  "error": "Invalid stock data"
}
```

---

# Bid APIs

## Get Current Bid

### Endpoint: `/api/bid`

#### Method: `GET`

#### Request Headers:

- **Authorization**: `Bearer <token>` (Token generated during user login)
- **Content-Type**: `application/json`

#### Response:

##### Success (200):

```json
{
  "currentBid": {
    "stockId": "12345",
    "price": 500,
    "currentBidder": {
      "_id": "userId123",
      "name": "John Doe"
    },
    "bidders": [
      {
        "_id": "userId123",
        "name": "John Doe"
      },
      {
        "_id": "userId456",
        "name": "Jane Smith"
      }
    ]
  }
}
```

##### Error (400 / 500):

```json
{
  "error": "Unable to fetch the current bid"
}
```

---

## Place a Bid

### Endpoint: `/api/bid`

#### Method: `PUT`

#### Request Headers:

- **Authorization**: `Bearer <token>` (Token generated during user login)
- **Content-Type**: `application/json`

#### Request Body:

```json
{
  "id": "12345",
  "bid": 600
}
```

#### Response:

##### Success (200):

```json
{
  "success": true,
  "stock": {
    "_id": "12345",
    "price": 600,
    "currentBidder": {
      "_id": "userId123",
      "name": "John Doe"
    },
    "bidders": [
      {
        "_id": "userId123",
        "name": "John Doe"
      },
      {
        "_id": "userId456",
        "name": "Jane Smith"
      }
    ]
  }
}
```

##### Error (400):

```json
{
  "error": "Bid must be higher than the current price"
}
```

##### Error (404):

```json
{
  "error": "Stock not found"
}
```

##### Error (500):

```json
{
  "error": "Failed to place a bid"
}
```

---

## Close Bids

### Endpoint: `/api/bid`

#### Method: `PATCH`

#### Request Headers:

- **Authorization**: `Bearer <token>` (Token generated during user login)
- **Content-Type**: `application/json`

#### Request Body:

```json
{
  "id": "12345"
}
```

#### Response:

##### Success (200):

```json
{
  "success": true,
  "message": "Bids closed successfully",
  "stock": {
    "_id": "12345",
    "price": 600,
    "winner": {
      "_id": "userId123",
      "name": "John Doe"
    }
  }
}
```

##### Error (400):

```json
{
  "error": "Cannot close bids for this stock"
}
```

##### Error (404):

```json
{
  "error": "Stock not found"
}
```

##### Error (500):

```json
{
  "error": "Failed to close bids"
}
```

---

### Contributers

- [Jeevan Joshi](https://github.com/jeevanjoshi4434)

---
