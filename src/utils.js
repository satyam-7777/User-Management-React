export async function saveUserData(userToBeSaved, onSetUsers) {
  const { name, user_id, email } = userToBeSaved;

  // Mark user as saving
  onSetUsers((prevUsers) =>
    prevUsers.map((user) => (user.user_id === user_id ? { ...user, status: "saving" } : user)),
  );

  try {
    const response = await fetch("http://localhost:7676/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, name, email }),
    });

    if (response.status !== 200 && response.status !== 500) {
      throw new Error("Error occurred while saving user data");
    }

    const status = response.status === 200 ? "success" : "failed";

    onSetUsers((prevUsers) =>
      prevUsers.map((user) => (user.user_id === user_id ? { ...user, status } : user)),
    );
  } catch (err) {
    console.log(err.message);

    onSetUsers((prevUsers) =>
      prevUsers.map((user) => (user.user_id === user_id ? { ...user, status: "failed" } : user)),
    );
  }
}
