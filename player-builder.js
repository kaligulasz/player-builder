(function () {
  'use strict';

  window.PlayerApi = function () {
    // Global references
    this.fetchedData = null;

    // default options
    var defaults = {
      container: false,
      boxClass: 'video-box',
      boxJsClass: 'js-video-box',
      titleClass: 'video-box__title',
      thumbnailClass: 'video-box__thumbnail',
      playerContainerClass: 'video-container',
      playerContainer: 'js-player-container',
      playerUrl: null,
      publisherId: null,
      playerUuid: null
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
    this.playerUuid = this.options.playerUuid || parsedData.config.uuid;

    if (this.options.container) {
      buildDomStructure.call(this);
    }
  }

  function emitReadyFetchEvent() {
    var event = new Event('player_fetch_data_successful');
    window.dispatchEvent(event);
  }

  function buildDomStructure() {
    var container;
    var domFragment;
    var data = this.fetchedData;
    var playerContainer = document.createElement('div');
    var playerScript = document.createElement('script');

    if (typeof this.options.container === 'string') {
      container = document.querySelector(this.options.container);
    } else {
      throw new Error('invalid container selector');
    }

    // Create a DocumentFragment to build with
    domFragment = document.createDocumentFragment();

    // Create main player container
    playerScript.setAttribute('src', this.options.playerUrl + '#' + this.playerUuid + '.' + this.options.publisherId);
    playerContainer.id = this.options.playerContainer;
    playerContainer.classList.add(this.options.playerContainerClass);
    domFragment.appendChild(playerContainer);

    // Create DOM elements
    for (var i = 0; i < data.length; i++) {
      var content = document.createElement('div');
      var title = document.createElement('h4');
      var thumbnail = document.createElement('img');

      // Add class for created DOM elements
      content.classList.add(this.options.boxClass);
      content.classList.add(this.options.boxJsClass);
      title.classList.add(this.options.titleClass);
      thumbnail.classList.add(this.options.thumbnailClass);

      // Add attributes for created DOM elements
      content.setAttribute('data-uuid', data[i].uuid);


      title.innerText = data[i].title;
      playerContainer.appendChild(playerScript);
      content.appendChild(title);
      domFragment.appendChild(content);
    }

    // Append DocumentFragment to container
    container.appendChild(domFragment);

    InitializeEvents.call(this);
  }

  function InitializeEvents() {
    var boxes = document.getElementsByClassName(this.options.boxJsClass);
    var playerContainer = document.getElementById(this.options.playerContainer);
    var options = this.options;

    for (var i = 0; i < boxes.length; i++) {
      boxes[i].addEventListener('click', function() {
        var playerScript = document.createElement('script');

        playerScript.setAttribute('src', options.playerUrl + '#' + this.getAttribute('data-uuid') + '.' + options.publisherId);
        playerContainer.innerHTML = '';
        playerContainer.appendChild(playerScript);
      });
    }
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

console.log('test pull request');