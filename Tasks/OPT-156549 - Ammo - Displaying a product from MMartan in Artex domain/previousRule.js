/* OPT-140472 START */
Insider.__external.AddSliderNavigation = function (config) {
    const isMobile = Insider.browser.isMobile();

    this.isInitiated = false;
    this.currentDotNumber;
    this.currentAttribute = 'current';
    this.recommenderConfig = config;
    this.variationId = config.variationId;
    this.classCurrentDot = 'ins-current-dot';
    this.dataCurrentAttribute = 'data-current';
    this.wrapperSelector = `.ins-preview-wrapper-${ this.variationId }`;
    this.clickEventName = isMobile ? 'touchend' : 'click';
    this.browserSelector = isMobile ? 'mobile-web' : 'web';
    this.selectors = {
        slideDot: '.ins-slider-dot',
        currentDot: '.ins-current-dot',
        nextArrow: `${ this.wrapperSelector } .ins-slider-next`,
        dotSelector: `${ this.wrapperSelector } .ins-slider-dot span`,
        slideSelector: `${ this.wrapperSelector } .ins-slider-arrow-element`,
        bodyWrapper: `${ this.wrapperSelector } .ins-${ this.browserSelector }-smart-recommender-body`,
        mainWrapper: `${ this.wrapperSelector } .ins-${ this.browserSelector }-smart-recommender-main-wrapper`,
        boxItemSelector: `${ this.wrapperSelector } .ins-${ this.browserSelector }-smart-recommender-box-item`,
        prevArrow: `${ this.wrapperSelector } .ins-slider-prev`,
        slideDotBox: `${ this.wrapperSelector } .ins-slider-dot-box`,
    };
    this.itemLength = Insider.dom(this.selectors.boxItemSelector).length;
    this.styleTag =
  `${ this.wrapperSelector } .ins-current-dot {
      background: #433e66 !important;
  }
  ${ this.wrapperSelector } .ins-slider-dot {
      text-align: center;
      display: inline-block !important;
  }
  ${ this.wrapperSelector } .ins-disabled-arrow {
      opacity: .5 !important;
      cursor: default !important;
  }
  ${ this.wrapperSelector } .ins-dot-element {
      cursor:pointer;
      width: 10px;
      height: 10px;
      margin: 5px 7px;
      background: #d6d6d6;
      display: block;
      -webkit-backface-visibility: visible;
      transition: opacity .2s ease;
      border-radius: 30px !important;
  }
  ${ this.selectors.slideDotBox } {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      text-align: center;
      gap: 0 55px;
  }`;
};

Insider.__external.AddSliderNavigation.prototype.init = function () {
    const that = this;

    Insider.fns.onElementLoaded(that.wrapperSelector, () => {
        if (!that.isInitiated) {
            that.reset();
            that.addStyles();
        }

        that.editSlideDot();
        that.setSlideDotClassEvents();
        that.autoSlide();

        that.isInitiated = true;
    }).listen();
};

Insider.__external.AddSliderNavigation.prototype.reset = function () {
    const { mainWrapper, nextArrow, prevArrow } = this.selectors;

    Insider.dom(mainWrapper).append(Insider.dom(nextArrow)).prepend(Insider.dom(prevArrow));
    Insider.dom(`${ this.wrapperSelector } .ins-slider-dot-box`).remove();
    Insider.dom(`ins-custom-style-${ this.variationId }`).remove();
};

Insider.__external.AddSliderNavigation.prototype.addStyles = function () {
    const style =
  `<style class="ins-custom-style-${ this.variationId }">
      ${ this.styleTag }
  </style>`;

    Insider.dom('head').append(style);
};

Insider.__external.AddSliderNavigation.prototype.editSlideDot = function () {
    const that = this;
    const { mainWrapper, nextArrow, prevArrow, slideDot, slideDotBox } = that.selectors;

    if (!that.isInitiated) {
        const itemLeftToShow = that.itemLength - that.recommenderConfig.windowItemCount;
        const navigationDotCount = Math.ceil(itemLeftToShow / that.recommenderConfig.dotSlidingItemCount) + 1;
        let count = 0;
        let dotContainer = '';

        for (let index = 0; index < navigationDotCount; index++) {
            const dotElement =
          `<div class="ins-slider-dot" current="${ count }">
              <span class="ins-dot-element"></span>
          </div>`;

            count += 1;
            dotContainer += dotElement;
        }

        const slideDotsHTML =
      `<div class="ins-slider-dot-box">
          <div class="ins-slider-dot-container">
              ${ dotContainer }
          </div>
      </div>`;

        Insider.dom(mainWrapper).append(slideDotsHTML);
        Insider.dom(slideDotBox).append(Insider.dom(nextArrow)).prepend(Insider.dom(prevArrow));
    }

    Insider.dom(`${ slideDot }:first span`).addClass(that.classCurrentDot);
};

Insider.__external.AddSliderNavigation.prototype.setSlideDotClassEvents = function () {
    const that = this;
    const { mainWrapper, dotSelector } = that.selectors;

    Insider.fns.onElementLoaded(dotSelector, () => {
        setTimeout(() => {
            that.bindEvents();

            Insider.eventManager.once(`${ that.clickEventName }.ins:set:class:${ that.variationId }`, `${ mainWrapper },
          ${ dotSelector }`, () => {
                that.editSlideDotClass();
            });
        }, 500);
    }).listen();
};

Insider.__external.AddSliderNavigation.prototype.bindEvents = function () {
    const that = this;
    const slideDotSelector = `${ that.wrapperSelector } ${ that.selectors.slideDot }`;

    Insider.fns.onElementLoaded(slideDotSelector, () => {
        setTimeout(() => {
            that.currentDotNumber = Number(Insider.dom(that.selectors.currentDot)
                .parent(that.selectors.slideDot).attr(that.currentAttribute));

            Insider.eventManager.once(`${ that.clickEventName }.ins:versus:dot:${ that.variationId }`, slideDotSelector,
                (event) => {

                    if (event.target.nodeName === 'SPAN') {
                        const selectedDotNumber = Number(Insider.dom(event.target)
                            .parent(that.selectors.slideDot).attr(that.currentAttribute));

                        if (that.currentDotNumber > selectedDotNumber) {
                            that.slideToLeft(that.currentDotNumber - selectedDotNumber);
                        } else if (that.currentDotNumber < selectedDotNumber) {
                            that.slideToRight(selectedDotNumber - that.currentDotNumber);
                        }

                        that.currentDotNumber = selectedDotNumber;
                    }
                });
        }, 300);
    }).listen();
};

Insider.__external.AddSliderNavigation.prototype.slideToLeft = function (customData) {
    const currentItem = Number(Insider.dom(this.selectors.bodyWrapper).attr(this.dataCurrentAttribute));
    let newCurrentItem = currentItem -
      (this.recommenderConfig.dotSlidingItemCount * (typeof customData === 'number' ? customData : 1));

    if (newCurrentItem + this.recommenderConfig.dotSlidingItemCount === 0) {
        if (!this.recommenderConfig.isLoopActive) {
            return;
        }

        newCurrentItem = this.itemLength - Math.floor(this.recommenderConfig.windowItemCount);
    } else if (newCurrentItem < 0) {
        newCurrentItem = 0;
    }

    this.slideTo(newCurrentItem);
};

Insider.__external.AddSliderNavigation.prototype.slideToRight = function (customData) {
    const currentItem = Number(Insider.dom(this.selectors.bodyWrapper).attr(this.dataCurrentAttribute));
    let newCurrentItem = currentItem +
      (this.recommenderConfig.dotSlidingItemCount * (typeof customData === 'number' ? customData : 1));
    const windowItemCount = Math.floor(this.recommenderConfig.windowItemCount);
    const itemCount = Math.floor(this.itemLength);
    const emptyAreaCount = Math.abs(windowItemCount - this.recommenderConfig.dotSlidingItemCount);

    if (newCurrentItem + emptyAreaCount >= itemCount) {
        if (!this.recommenderConfig.isLoopActive) {
            return;
        }

        newCurrentItem = 0;
    } else if (itemCount - newCurrentItem < windowItemCount) {
        newCurrentItem = itemCount - windowItemCount;
    }

    this.slideTo(newCurrentItem);
};

Insider.__external.AddSliderNavigation.prototype.slideTo = function (newCurrentItem) {
    const { boxItemSelector, bodyWrapper } = this.selectors;
    const eachItemWidth = parseFloat(Insider.dom(boxItemSelector).css('width'));
    let betweenItemMargin = parseFloat(Insider.dom(boxItemSelector).css('margin') || 0) * 2;

    if (betweenItemMargin === 0) {
        betweenItemMargin = parseFloat(Insider.dom(boxItemSelector).parent().css('gap') || 0);
    }

    const newPosition = newCurrentItem * (eachItemWidth + betweenItemMargin);

    Insider.dom(bodyWrapper).attr(this.dataCurrentAttribute, newCurrentItem);
    Insider.dom(bodyWrapper).css('transform', `translateX(-${ newPosition }px)`);
};

Insider.__external.AddSliderNavigation.prototype.editSlideDotClass = function () {
    const that = this;

    setTimeout(() => {
        const { bodyWrapper, currentDot, slideDot } = that.selectors;
        const dataCurrent = Number(Insider.dom(bodyWrapper).attr(that.dataCurrentAttribute)) || 0;
        let currentCount;
        const dataCurrentMode = dataCurrent % that.recommenderConfig.dotSlidingItemCount;

        if (dataCurrent === 0) {
            currentCount = 0;
        } else if (dataCurrentMode === 0) {
            currentCount = dataCurrent / that.recommenderConfig.dotSlidingItemCount;
        } else if (dataCurrentMode !== 0) {
            currentCount = ((dataCurrent - dataCurrentMode) / that.recommenderConfig.dotSlidingItemCount) + 1;
        }

        Insider.dom('.ins-slider-dot span').removeClass(that.classCurrentDot);
        Insider.dom(`.ins-slider-dot[current="${ currentCount }"] span`).addClass(that.classCurrentDot);

        that.currentDotNumber = Number(Insider.dom(currentDot).parent(slideDot).attr(that.currentAttribute));
    }, 300);
};

Insider.__external.AddSliderNavigation.prototype.autoSlide = function () {
    if (this.recommenderConfig.autoSlide) {
        const attributeName = `ins-intervalId${ this.variationId }`;
        const that = this;

        clearInterval(Insider.dom('body').attr(attributeName));

        const intervalId = setInterval(() => {
            Insider.dom(that.selectors.nextArrow).click();
        }, 5000);

        Insider.dom('body').attr(attributeName, intervalId);
    }
};

true;
/* OPT-140472 END */
