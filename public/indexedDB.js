let db;
// create a new db request for a "budget" database.
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
   // create object store called "pending" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
  
    // check if app is online before reading from db
    if (navigator.onLine) {
      checkDatabase();
    }
  };
  
  request.onerror = function(event) {
    console.log("Sorry!! " + event.target.errorCode);
  };

  function saveRecord(record) {
    // create a transaction on the pending db with readwrite access. Then access 
    //pending object store
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    
    // add record to your store with add method.
    store.add(record);
  }

