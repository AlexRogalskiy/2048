window.fakeStorage = {
  setItem: function (id, val) {
    console.log("", id, val)
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};


function LocalStorageManager() {
  this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameState";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = async function () {
  // return this.storage.getItem(this.bestScoreKey) || 0;
  let r  = await fetch(`/api?key=${this.bestScoreKey}`)
  let stateJSON = await r.json()
  // console.log(stateJSON)
  return stateJSON? stateJSON.value : 0;
};

LocalStorageManager.prototype.setBestScore = async function (score) {
  await fetch("/api", {
    method: "post",
    body: JSON.stringify({key: this.bestScoreKey, value: score})
  }).then(r => r.json())
  // console.log("setBestScore", this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = async function () {
  // var stateJSON = this.storage.getItem(this.gameStateKey);
  let r  = await fetch(`/api?key=${this.gameStateKey}`)
  let stateJSON = await r.json()
  // console.log(stateJSON)
  return stateJSON? stateJSON.value : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  fetch("/api", {
    method: "post",
    body: JSON.stringify({key: this.gameStateKey, value: gameState})
  }).then(r => r.json())
  // console.log("setGameState", this.gameStateKey, gameState);
  // this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  fetch(`/api?key=${this.gameStateKey}`, {method: "delete"})
};
