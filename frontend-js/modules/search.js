module.exports=class Search {
  constructor() {
    this.injectHTML();
    this.headerSearchIcon = document.querySelector(".header-search-icon");
    this.overlay = document.querySelector(".search-overlay");
    this.closeIcon = document.querySelector(".close-live-search");
    this.inputField = document.querySelector("#live-search-field");
    this.events();
  }

  events() {
    this.headerSearchIcon.addEventListener("click", (e) => {
      e.preventDefault();
      this.openOverlay();
    });

    this.closeIcon.addEventListener("click", () => this.closeOverlay());
  }

  openOverlay() {
    this.overlay.classList.add("search-overlay--visible");
    setTimeout(() => this.inputField.focus(), 50);
  }

  closeOverlay() {
    this.overlay.classList.remove("search-overlay--visible");
  }

  injectHTML() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="search-overlay">
        <div class="search-overlay-top shadow-sm">
          <div class="container container--narrow">
            <label for="live-search-field" class="search-overlay-icon"><i class="fas fa-search"></i></label>
            <input type="text" id="live-search-field" class="live-search-field" placeholder="What are you interested in?">
            <span class="close-live-search"><i class="fas fa-times-circle"></i></span>
          </div>
        </div>
        <div class="search-overlay-bottom">
          <div class="container container--narrow py-3">
            <div class="circle-loader"></div>
            <div class="live-search-results"></div>
          </div>
        </div>
      </div>
    `);
  }
}