import { useEffect, useState } from "react";
import { RefreshCw, Check } from "lucide-react";
import { saveUserData } from "./utils";

function App() {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");

    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  return (
    <div className="app">
      <Header />
      <MainContent users={users} onSetUsers={setUsers} />
    </div>
  );
}

function Header() {
  return <h1 className="header">USERS (Flakey Server)</h1>;
}

function MainContent({ users, onSetUsers }) {
  return (
    <div className="main-container">
      <div className="form-section">
        <UserForm users={users} onSetUsers={onSetUsers} />
      </div>

      <div className="users-section">
        <UserContainer users={users} onSetUsers={onSetUsers} />
        <Stats users={users} />
      </div>
    </div>
  );
}

function UserForm({ users, onSetUsers }) {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const user = {
      user_id: users.length + 1,
      name,
      email,
      status: "saving",
    };

    onSetUsers((prevUsers) => [...prevUsers, user]);

    // communicating to server for saving the data
    saveUserData(user, onSetUsers);

    setUserId("");
    setName("");
    setEmail("");
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="user_id">User ID</label>
        <input id="user_id" value={userId} onChange={(e) => setUserId(e.target.value)} disabled />
      </div>

      <div className="field-group">
        <label htmlFor="name">
          Name <sup>*</sup>
        </label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="field-group">
        <label htmlFor="email">
          Email <sup>*</sup>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button className="save-btn" type="submit">
        Save
      </button>
    </form>
  );
}

function UserContainer({ users, onSetUsers }) {
  return (
    <div className="user-container">
      {users.map((user) => (
        <User key={user.user_id} user={user} users={users} onSetUsers={onSetUsers} />
      ))}
    </div>
  );
}

function User({ user, onSetUsers }) {
  //   const isSaved = user.status === "success";

  function handleRetry() {
    saveUserData(user, onSetUsers);
  }

  return (
    <div className="user-card">
      <span className="user-id">{`USER_${user.user_id}`}</span>

      <span className={`status ${user.status}`}>
        {user.status === "success" ? "Saved" : user.status === "saving" ? "Saving..." : "Not saved"}
      </span>

      <div className="user-action">
        {user.status === "success" && <Check className="success-icon" size={20} />}

        {user.status === "saving" && <RefreshCw className="saving-icon" size={18} />}

        {user.status === "failed" && (
          <button type="button" className="retry-btn" onClick={handleRetry}>
            <RefreshCw size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
function Stats({ users }) {
  const savedCount = users.filter((user) => user.status === "success").length;

  return (
    <p className="stats">
      {savedCount} out of {users.length} users saved
    </p>
  );
}

export default App;
