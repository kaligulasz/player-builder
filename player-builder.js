(function () {
  'use strict';

  window.PlayerApi = function () {
    // Global references
    this.fetchedData = null;

    // default options
    var defaults = {
      container: false
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }
  };

  // Utility method to extend defaults with user options
  function extendDefaults(source, properties) {
    var property;

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }

    return source;
  }

  // Private methods
  function dataCallbackReturn(data) {
    var parsedData = JSON.parse(data);

    this.fetchedData = parsedData.config.dataSource.sourceItems[0].videos;

    if (this.options.container) {
      buildGrid.call(this);
    }
  }

  function emitReadyFetchEvent() {
    var event = new Event('player_fetch_data_successful');
    window.dispatchEvent(event);
  }

  function buildGrid() {
    var container;
    var domFragment;
    var data = this.fetchedData;

    if (typeof this.options.container === 'string') {
      container = document.querySelector(this.options.container);
    } else {
      throw new Error('invalid container selector');
    }

    // Create a DocumentFragment to build with
    domFragment = document.createDocumentFragment();

    // Create dom elements
    for (var i = 0; i < data.length; i++) {
      var content = document.createElement('div')
      var title = document.createElement('h4');

      title.innerText = data[i].title;
      content.appendChild(title);
      domFragment.appendChild(content);
    }

    // Append DocumentFragment to container
    container.appendChild(domFragment);

  }

  // Public methods
  PlayerApi.prototype.fetch = function (url, publisherId, playerId) {
    var thisContext = this;
    var request = new XMLHttpRequest();

    request.open('GET', '//' + url + '/epbootstrap/' + publisherId + '/' + playerId + '/?_fmt=json&_rt=c', true);
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          dataCallbackReturn.call(thisContext, request.responseText);
          emitReadyFetchEvent();
        } else {
          console.log('Player fetch data error');
        }
      }
    };

    request.send(null);
  };
}());
