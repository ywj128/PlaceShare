import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "1",
      name: "Tom Jade",
      image:
        "https://www.verywellmind.com/thmb/fcB45Y2_4efpRrcrkxliTqk6EmU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-4660327211-56b5fae93df78c0b13571d1e.jpg",
      places: 3
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
