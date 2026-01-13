// Sample code with common bug patterns

function processUserData(user) {
    // Fixed: Using strict equality comparison
    if (user.age === 25) {
        console.log("User is 25 years old");
    }

    // Fixed: Added null/undefined check before accessing nested property
    const userName = user?.profile?.name?.toUpperCase() || 'Unknown';

    // Fixed: Using let instead of var
    let counter = 0;
    for (let i = 0; i < 10; i++) {
        counter += i;
    }

    // Fixed: Proper error handling in catch block
    try {
        JSON.parse(user.data);
    } catch (e) {
        console.error('Failed to parse user data:', e.message);
        // Handle the error appropriately
    }

    return userName;
}

// Bug 5: Comparing with null using == instead of ===
function checkValue(value) {
    if (value == null) {
        return "Value is null or undefined";
    }
    return value;
}

module.exports = { processUserData, checkValue };
