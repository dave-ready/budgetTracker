// create a new db request for a "budget" database.
const request = indexedDB.open("budget", 1);
let db;

request.onupgradeneeded = function (event) {
// create object store called "pending" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
// check if app is online before reading from db
  if (navigator.onLine) {
  checkDatabase();
  }
}
request.onerror = function (event) {
  console.log("Sorry!! " + event.target.errorCode);
  };

function saveRecord(record) {
// create a transaction on the pending database, then access pending object store.
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
    
  // add record to your store using add() method.
  store.add(record);
  };

function checkDatabase() {
    // create a transaction on the pending db, then access pending object store.
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    // get all records from store with getAll() method and set to a variable.
    const getAll = store.getAll();
    getAll.onsuccess = function() {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(() => {
          //If successful, open a transaction on your pending database. then access your pending object store
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          // clear all items in your store using clear() method
          store.clear();
        });
      }
    };
  }

function deletePending() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.clear();
  }
  
  // listen for app coming back online
  window.addEventListener("online", checkDatabase);
 
  


