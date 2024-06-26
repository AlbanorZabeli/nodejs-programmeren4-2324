const database = require('../../DbConnection')
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.
//
const MealDao = {

    // Ieder nieuw item in db krijgt 'autoincrement' index.
    // Je moet die wel zelf toevoegen aan ieder nieuw item.
    _index: 2,
    _delayTime: 500,

    getAll(callback) {
        let query =
          "SELECT * FROM meal"
        database.query(query, (error, results) => {
          if (error) {
            callback(error)
            return
          }
          callback(null, results)
        })
     
    },

    getById(id, callback) {
        let query = "SELECT * FROM meal WHERE id = ?";
    
        // Execute the SQL query using the database connection
        database.query(query, [id], (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
            // Check if any result is returned; if not, handle the "not found" case
            if (results.length === 0) {
                callback({ message: `Error: Meal with id ${id} does not exist!` }, null);
            } else {
                // Return the first result since ID should be unique and only one record should match
                callback(null, results[0]);
            }
        });
    },
    
    add(meal, callback) {
        let query = "INSERT INTO meal (id, isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
        // Prepare the values to be inserted
        let values = [meal.id, meal.isActive, meal.isVega, meal.isVegan, meal.isToTakeHome, meal.dateTime, meal.maxAmountOfParticipants, meal.price, meal.imageUrl, meal.cookId, meal.createDate, meal.updateDate, meal.name, meal.description, meal.allergenes];
    
        // Execute the SQL query to insert the new meal
        database.query(query, values, (error, results) => {
            if (error) {
                callback(error);
                return;
            }
    
            // Assuming 'results' contains information about the inserted row, including the newly assigned ID
            // If your DB doesn't return this, you might need to execute a follow-up query to fetch it
            let newId = results.insertId;
            // You may want to fetch the meal back from the DB or construct the object with the ID and send it back
            callback(null, {
                id: newId,
                ...meal
            });
        });
    },
    
    delete(id, cookId, callback) {
        const checkQuery = "SELECT * FROM meal WHERE id = ? AND cookId = ?";
        database.query(checkQuery, [id, cookId], (checkError, checkResults) => {
            if (checkError) {
                return callback(checkError, null);
            }
    
            // If no meal exists with the given ID and cookId, return an error
            if (checkResults.length === 0) {
                const err = new Error('No existing meal was found with id: ' + id + ' for the given user.');
                return callback(err, null);
            } else {
                // Meal exists and is owned by the cook, proceed with deletion
                const deleteQuery = "DELETE FROM meal WHERE id = ? AND cookId = ?";
                database.query(deleteQuery, [id, cookId], (deleteError, deleteResults) => {
                    if (deleteError) {
                        return callback(deleteError, null);
                    }                    
                    if (deleteResults.affectedRows === 0) {
                        const err = new Error('No existing meal was found with id: ' + id);
                        return callback(err, null);
                    }
                    // Confirm deletion
                    callback(null, { message: `Meal with id ${id} deleted successfully.` });
                });
            }
        });
}
}
    

module.exports = MealDao
// module.exports = database.index;
