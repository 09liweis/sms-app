<script lang="ts">
  let username = '';
  let port = 1;
  let ipAddress = '';

  async function createUser() {
    const response = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, port, ipAddress }),
    });

    if (response.ok) {
      alert('User created successfully!');
      username = '';
      port = 1;
      ipAddress = '';
    } else {
      alert('Failed to create user.');
    }
  }
</script>

<div class="admin-page">
  <h1>Create User</h1>
  <form on:submit|preventDefault={createUser}>
    <div>
      <label for="username">Username:</label>
      <input type="text" id="username" bind:value={username} required />
    </div>
    <div>
      <label for="port">Port (1-64):</label>
      <input type="number" id="port" bind:value={port} min="1" max="64" required />
    </div>
    <div>
      <label for="ipAddress">IP Address:</label>
      <input type="text" id="ipAddress" bind:value={ipAddress} required />
    </div>
    <button type="submit">Create User</button>
  </form>
</div>

<style>
  .admin-page {
    padding: 20px;
  }
  form div {
    margin-bottom: 10px;
  }
  label {
    display: inline-block;
    width: 120px;
  }
  input {
    padding: 5px;
    width: 200px;
  }
  button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
</style>