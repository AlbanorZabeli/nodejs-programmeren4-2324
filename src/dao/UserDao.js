const database = require('../../DbConnection')
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.
//
const UserDao = {

    // Ieder nieuw item in db krijgt 'autoincrement' index.
    // Je moet die wel zelf toevoegen aan ieder nieuw item.
    _index: 2,
    _delayTime: 500,

    getAll(callback) {
        let query =
          "SELECT id, firstName, lastName, isActive, emailAdress, phoneNumber, roles, street, city FROM user"
        database.query(query, (error, results) => {
          if (error) {
            callback(error)
            return
          }
          callback(null, results)
        })
     
    },

    getById(id, callback) {
        let query = "SELECT id, firstName, lastName, isActive, emailAdress, phoneNumber, roles, street, city FROM user WHERE id = ?";
    
        
        // Execute the SQL query using the database connection
        database.query(query, [id], (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
            // Check if any result is returned; if not, handle the "not found" case
            if (results.length === 0) {
                callback({ message: `Error: User with id ${id} does not exist!` }, null);
            } else {
                // Return the first result since ID should be unique and only one record should match
                callback(null, results[0]);
            }
        });


        let querymeals = 'SELECT * FROM meals WHERE userId = ? AND dateTime >= NOW()';

        database.query(querymeals, [id], (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
            // Check if any result is returned; if not, handle the "not found" case
            if (results.length === 0) {
                callback({ message: `Error: User with id ${id} does not exist!` }, null);
            } else {
                // Return the first result since ID should be unique and only one record should match
                callback(null, results[0]);
            }
        });
    },

    getProfileById(id, callback) {
        let query = "SELECT id, firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city FROM user WHERE id = ?";
    
        // Execute the SQL query using the database connection
        database.query(query, [id], (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
            // Check if any result is returned; if not, handle the "not found" case
            if (results.length === 0) {
                callback({ message: `Error: User with id ${id} does not exist!` }, null);
            } else {
                // Return the first result since ID should be unique and only one record should match
                callback(null, results[0]);
            }
        });
    },
    
    add(user, callback) {
        let query = "INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
        // Prepare the values to be inserted
        let values = [user.firstName, user.lastName, user.isActive, user.emailAdress, user.password, user.phoneNumber, JSON.stringify(user.roles), user.street, user.city];
    
        // Execute the SQL query to insert the new user
        database.query(query, values, (error, results) => {
            if (error) {
                callback(error);
                return;
            }
    
            // Assuming 'results' contains information about the inserted row, including the newly assigned ID
            // If your DB doesn't return this, you might need to execute a follow-up query to fetch it
            let newId = results.insertId;
            // You may want to fetch the user back from the DB or construct the object with the ID and send it back
            callback(null, {
                id: newId,
                ...user
            });
        });
    },
    
    delete(id, callback) {
        let query = "DELETE FROM user WHERE id = ?";
    
        // Execute the SQL query to delete the user by ID
        database.query(query, [id], (error, results) => {
            if (error) {
                callback(error);
                return;
            }
    
            // Check if any row was actually deleted
            if (results.affectedRows === 0) {
                callback({ message: `Error: User with id ${id} does not exist!` }, null);
            } else {
                callback(null, { message: `User with id ${id} deleted successfully.` });
            }
        });
    },
    
    update(id, updatedItem, callback) {
        let query = "UPDATE user SET firstName = ?, lastName = ?, isActive = ?, emailAdress = ?, phoneNumber = ?, roles = ?, street = ?, city = ? WHERE id = ?";
    
        // Prepare the values to be updated
        let values = [updatedItem.firstName, updatedItem.lastName, updatedItem.isActive, updatedItem.emailAdress, updatedItem.phoneNumber, JSON.stringify(updatedItem.roles), updatedItem.street, updatedItem.city, id];
    
        // Execute the SQL query to update the user by ID
        database.query(query, values, (error, results) => {
            if (error) {
                callback(error);
                return;
            }
    
            // Check if any row was actually updated
            if (results.affectedRows === 0) {
                callback({ message: `Error: User with id ${id} does not exist!` }, null);
            } else {
                callback(null, { message: `User with id ${id} updated successfully.`, data: { id, ...updatedItem } });
            }
        });
    },
}
    

module.exports = UserDao
// module.exports = database.index;
