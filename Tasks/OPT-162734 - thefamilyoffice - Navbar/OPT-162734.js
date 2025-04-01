/* OPT-162734 START */
((self) => {
    'use strict';

    const builderId = 578;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const classes = {
        navbar: `ins-clone-navbar-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        hidden: `ins-hidden-element-${ variationId }`,
        expanded: `ins-element-expanded-${ variationId }`,
        navbarPassive: 'css-1cbouum',
        navbarActive: 'css-1t5951b',
        anchorActive: 'css-5b689q',
        anchorPassive: 'css-d3x5t8',
        svgActive: 'css-1vx205z',
        svgPassive: 'css-hjvhmo'
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        partnerNavbar: 'nav:first',
        accordionItem: '.chakra-accordion__item',
        accordionPanel: '.chakra-accordion__panel',
        collapsible: '.chakra-collapse',
        visiblePanel: '.chakra-accordion__panel:visible',
        whoWeAre: '.chakra-link:contains("Who we are")',
        whatWeDo: '.chakra-link:contains("What we do")',
        financialTools: '.chakra-link:contains("Financial tools")',
        insights: '.chakra-link:contains("Insights")',
        firstAccordionItem: '.chakra-accordion__item:first',
        firstChakraLink: '.chakra-link:first',
        buttonTag: 'button',
        dropdownLinks: '.css-phgwr1 a, .css-dj6t4t img, .chakra-stack .css-j7qwjs a, .css-1xv7r9p a, .css-70qvj9 a',
        navbarButtons: '.css-gg4vpm button',
        partnerNavLocation: '#__next',
        navigationBar: 'nav',
        login: '.css-0',
        animatedDropdownLinks: '.css-phgwr1',
        partnerAddedElement: '.chakra-accordion__panel > div:not(:first-child)'
    });

    self.init = () => {
        if (variationId && Insider.dom(selectors.navigationBar).exists()) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.reset();
                self.buildCSS();
                self.cloneNavbar();
                self.buildHTML();
                self.setEvents();
            }

            return true;
        }
    };

    self.reset = () => {
        const { style, navbar, partnerNavLocation, navigationBar } = selectors;

        const originalNavbar = '<nav class=css-1cbouum dir=ltr><div bis_skin_checked=1 class=css-dj6t4t><a href=/en><img alt=tfo-logo data-nimg=1 decoding=async height=40 loading=lazy src=https://a.storyblok.com/f/234231/91x40/ee5c1e1cc5/tfo-logo.svg style=color:transparent width=91></a><div bis_skin_checked=1 class=css-17xq282 dir=ltr><ul class=css-adhs2p role=list><div bis_skin_checked=1 class="chakra-accordion css-s9cdvj"><div bis_skin_checked=1 class="chakra-accordion__item css-1mo122g"><div bis_skin_checked=1 class=css-gg4vpm><button class="chakra-accordion__button css-1oc2n8l"type=button aria-controls=accordion-panel-:r1o: aria-expanded=false data-index=0 id=accordion-button-:r1o:><a class="chakra-link css-d3x5t8">Who we are</a> <svg aria-hidden=true class="chakra-icon chakra-accordion__icon css-hjvhmo"focusable=false viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"fill=currentColor></path></svg></button></div><div bis_skin_checked=1 class=chakra-collapse style=overflow:hidden;display:none;opacity:0;height:0><div bis_skin_checked=1 class="chakra-accordion__panel css-uwizkk"aria-labelledby=accordion-button-:r1o: id=accordion-panel-:r1o: role=region></div></div></div><div bis_skin_checked=1 class="chakra-accordion__item css-1mo122g"><div bis_skin_checked=1 class=css-gg4vpm><button class="chakra-accordion__button css-1oc2n8l"type=button aria-controls=accordion-panel-:r1q: aria-expanded=false data-index=1 id=accordion-button-:r1q:><a class="chakra-link css-d3x5t8">What we do</a> <svg aria-hidden=true class="chakra-icon chakra-accordion__icon css-hjvhmo"focusable=false viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"fill=currentColor></path></svg></button></div><div bis_skin_checked=1 class=chakra-collapse style=overflow:hidden;display:none;opacity:0;height:0><div bis_skin_checked=1 class="chakra-accordion__panel css-uwizkk"aria-labelledby=accordion-button-:r1q: id=accordion-panel-:r1q: role=region></div></div></div><div bis_skin_checked=1 class="chakra-accordion__item css-1mo122g"><div bis_skin_checked=1 class=css-gg4vpm><button class="chakra-accordion__button css-1oc2n8l"type=button aria-controls=accordion-panel-:r1s: aria-expanded=false data-index=2 id=accordion-button-:r1s:><a class="chakra-link css-d3x5t8">Financial tools </a><svg aria-hidden=true class="chakra-icon chakra-accordion__icon css-hjvhmo"focusable=false viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"fill=currentColor></path></svg></button></div><div bis_skin_checked=1 class=chakra-collapse style=overflow:hidden;display:none;opacity:0;height:0><div bis_skin_checked=1 class="chakra-accordion__panel css-uwizkk"aria-labelledby=accordion-button-:r1s: id=accordion-panel-:r1s: role=region></div></div></div><div bis_skin_checked=1 class="chakra-accordion__item css-1mo122g"><div bis_skin_checked=1 class=css-gg4vpm><button class="chakra-accordion__button css-1oc2n8l"type=button aria-controls=accordion-panel-:r1u: aria-expanded=false data-index=3 id=accordion-button-:r1u:><a class="chakra-link css-d3x5t8">Insights</a> <svg aria-hidden=true class="chakra-icon chakra-accordion__icon css-hjvhmo"focusable=false viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"fill=currentColor></path></svg></button></div><div bis_skin_checked=1 class=chakra-collapse style=overflow:hidden;display:none;opacity:0;height:0><div bis_skin_checked=1 class="chakra-accordion__panel css-uwizkk"aria-labelledby=accordion-button-:r1u: id=accordion-panel-:r1u: role=region></div></div></div></div></ul><div bis_skin_checked=1 class=css-70qvj9><a class="chakra-link css-16erbwi"href=/ar/ ><span class=css-1jo27w0>عربي</span></a><span class=css-1uge0ov></span><a class="chakra-link css-1gen25y"href=/en/contact-us>Contact Us</a></div></div><div bis_skin_checked=1 class="chakra-stack css-fi4p8l"><div bis_skin_checked=1 class=css-k008qs><div bis_skin_checked=1 class=css-16f1itb><div bis_skin_checked=1 class="chakra-accordion css-1irm22w"><div bis_skin_checked=1 class="chakra-accordion__item css-1okxk8n"><div bis_skin_checked=1 class=css-gg4vpm><button class="chakra-accordion__button css-2fd57c"type=button aria-controls=accordion-panel-:r20: aria-expanded=false data-index=0 id=accordion-button-:r20:><span class=css-0>Login</span> <svg aria-hidden=true class="chakra-icon chakra-accordion__icon css-1kapntz"focusable=false viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"fill=currentColor></path></svg></button></div><div bis_skin_checked=1 class=chakra-collapse style=overflow:hidden;display:none;opacity:0;height:0><div bis_skin_checked=1 class="chakra-accordion__panel css-1w9xj16"aria-labelledby=accordion-button-:r20: id=accordion-panel-:r20: role=region><div bis_skin_checked=1 class="chakra-stack css-j7qwjs"><a class="chakra-link css-1pdatto"href="https://my.tfoco.com/login?type=client"target=_blank>Client Dashboard</a><div bis_skin_checked=1 class="chakra-stack__divider css-2kxnu9"></div><a class="chakra-link css-1pdatto"href=https://my.tfoco.com/en/login target=_blank>Investor Onboarding</a></div></div></div></div></div><div bis_skin_checked=1 class=css-1xv7r9p><a class="chakra-button css-1wl16de"href=https://my.tfoco.com/register target=_blank _uid=67cbfd10-1177-4a47-97e1-739d91a50186 component=topCTAItem direction=""scrolloffset=""scrolltosection="">Register</a></div></div><div bis_skin_checked=1 class=css-3w5ehn><button class="chakra-button css-19k6i69"type=button aria-label="Toggle Navigation"><svg aria-hidden=true class="chakra-icon css-1z12bf5"focusable=false viewBox="0 0 24 24"><path d="M 3 5 A 1.0001 1.0001 0 1 0 3 7 L 21 7 A 1.0001 1.0001 0 1 0 21 5 L 3 5 z M 3 11 A 1.0001 1.0001 0 1 0 3 13 L 21 13 A 1.0001 1.0001 0 1 0 21 11 L 3 11 z M 3 17 A 1.0001 1.0001 0 1 0 3 19 L 21 19 A 1.0001 1.0001 0 1 0 21 17 L 3 17 z"fill=currentColor></path></svg></button></div></div></div></div></nav>';

        Insider.dom(`${ style }, ${ navbar }`).remove();

        if (Insider.dom(navigationBar).length === 0) {
            Insider.dom(partnerNavLocation).prepend(originalNavbar);
        }
    };

    self.cloneNavbar = () => {
        const { partnerNavbar, firstAccordionItem, navbar: navbarSelector } = selectors;
        const { navbar, join } = classes;

        const newNavbar = Insider.dom(partnerNavbar).clone().addClass(navbar).addClass(join);
        const $firstElement = Insider.dom(newNavbar).find(firstAccordionItem);
        const $secondElement = $firstElement.next();
        const otherNavbars = `nav:not(${ navbarSelector })`;

        $firstElement.before($secondElement);

        Insider.dom(partnerNavbar).after(newNavbar);
        Insider.dom(otherNavbars).remove();
    };

    self.buildCSS = () => {
        const { hidden, navbar, anchorActive, collapsible, navbarActive, navbarPassive,
            partnerAddedElement } = selectors;

        const passiveNavbarColor = Insider.systemRules.call('isOnMainPage')
            ? 'var(--components-colors-transparent)'
            : 'var(--components-colors-gray-850)';

        const customStyle =
        `${ hidden } {
            display: none;
            opacity: 0;
            visibility: hidden;
        }
        ${ navbar } {
            display: flex !important;
            align-items: center !important;
            height: 11vh !important;
            position: fixed;
            top: 0;
            right: 0;
            z-index: 9;
            width: 100%;
        }
        ${ navbar } svg {
            height: 24px !important;
            width: 24px !important;
        }
        ${ navbar } .css-1v2vw2c {
            display: grid;
            grid-template-columns: repeat(3, 230px);
            max-width: var(--components-sizes-full);
            width: var(--components-sizes-full);
            row-gap: var(--components-space-4);
            column-gap: var(--components-space-9);
            margin: 0px;
            direction: ltr;
        }
        ${ navbar } .css-phgwr1 {
            padding-bottom: var(--components-space-4);
        }
        ${ navbar } .css-phgwr1 {
            transition: transform 0.3s ease-out;
        }
        ${ navbar } .css-phgwr1:visible {
            transform: translateY(0) !important;
        }
        ${ partnerAddedElement } {
            display: none;
        }
        ${ navbar } .css-teg8ak {
            transition-property: var(--components-transition-property-common);
            transition-duration: var(--components-transition-duration-fast);
            transition-timing-function: var(--components-transition-easing-ease-out);
            cursor: pointer;
            text-decoration: none;
            outline: transparent solid 2px;
            outline-offset: 2px;
            font-size: var(--components-fontSizes-md);
            padding-top: var(--components-space-2);
            padding-bottom: var(--components-space-2);
            width: var(--components-sizes-full);
            display: block;
            color: var(--components-colors-white);
        }
        ${ navbar } .css-1mm0rzc {
            display: flex;
            -webkit-box-align: baseline;
            align-items: center;
            gap: var(--components-space-2);
            transition: color var(--components-transition-duration-normal) ease;
        }
        ${ navbar } .css-1mm0rzc:hover {
            color: var(--components-colors-tfo-primary-500);
        }
        ${ navbar } .css-14ekiee {
            font-size: var(--components-fontSizes-md);
            font-weight: var(--components-fontWeights-medium);
        }
        ${ navbar } .css-68rnze {
            margin-top: var(--components-space-2);
            font-size: var(--components-fontSizes-xs);
            font-weight: var(--components-fontWeights-normal);
            color: var(--components-colors-gray-400);
        }
        ${ navbar } ${ collapsible } {
            display: none;
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition: opacity 0.2s ease, max-height 0.2s ease;
        }
        ${ navbar } .css-1vx205z {
            color: unset;
            transform: unset;
        }
        ${ navbar } ${ collapsible }.animateDropdown {
            display: block !important;
            opacity: 1 !important;
            max-height: auto !important;
        }
        ${ anchorActive } + svg {
            color: var(--components-colors-tfo-primary-500) !important;
            transform: rotate(-180deg) !important;
            transition-duration: 300ms;
        }
        ${ navbar } .css-dj6t4t {
            width: 90vw !important;
        }
        ${ navbarActive } {
            height: 11vh;
            background-color: var(--components-colors-gray-850);
        }
        ${ navbarPassive } {
            background-color: ${ passiveNavbarColor };
        }
        @media (max-width: 1280px) {
            ${ navbar } {
                display: none !important;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { whoWeAre, whatWeDo, financialTools, insights } = selectors;

        const whoWeAreHTML = '<div bis_skin_checked=1 style=height:inherit;opacity:1;transform:none><div bis_skin_checked=1 class=css-1v2vw2c><div bis_skin_checked=1 class=css-phgwr1><a _uid=d6855aa7-d0b7-45c7-9d79-f6f5fb58bc40 class="chakra-link css-teg8ak"component=childRoutes href=/en/about-us icontext=about-us shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M21.5 18.3H6.3H6.2L2 21.7999V18.3V3.79995C2 3.69995 2.1 3.69995 2.1 3.69995H21.4C21.5 3.69995 21.5 3.79995 21.5 3.79995V18.2C21.6 18.3 21.6 18.3 21.5 18.3Z"stroke=currentColor></path><path d="M11.8 10.3V15.1"stroke=currentColor></path><path d="M11.8 6.59998V8.19998"stroke=currentColor></path></svg> <span class=css-14ekiee>About Us</span></div><p class="chakra-text css-68rnze"><span>Get a general overview about The Family Office and its principles</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=38b85425-abf3-43f1-b3ac-91ebd9f2adb7 class="chakra-link css-teg8ak"component=childRoutes href=/en/about-us/investment-philosophy icontext=investment-philosophy shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M22.0489 19.0067H2.27467C2.13735 19.0067 2.00003 18.8694 2.00003 18.7321V5.27464C2.00003 5.13732 2.13735 5 2.27467 5H22.1862C22.3235 5 22.4608 5.13732 22.4608 5.27464V18.7321C22.3235 18.8694 22.1862 19.0067 22.0489 19.0067Z"stroke=currentColor></path><path d="M12.1618 5V19.0067"stroke=currentColor></path><path d="M19.165 12.0033H15.0454"stroke=currentColor></path><path d="M19.165 15.0244H15.0454"stroke=currentColor></path><path d="M19.165 8.98218H15.0454"stroke=currentColor></path></svg> <span class=css-14ekiee>Investment Philosophy</span></div><p class="chakra-text css-68rnze"><span>Discover our six core principles that lead our philosophy</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=26ab02aa-ca62-4f58-a4b7-44dc589038f4 class="chakra-link css-teg8ak"component=childRoutes href=/en/about-us/board-of-directors icontext=board-members shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M8.02499 11.25C9.68185 11.25 11.025 9.90685 11.025 8.25C11.025 6.59315 9.68185 5.25 8.02499 5.25C6.36814 5.25 5.02499 6.59315 5.02499 8.25C5.02499 9.90685 6.36814 11.25 8.02499 11.25Z"stroke=currentColor></path><path d="M17.55 12.675C19.2068 12.675 20.55 11.3319 20.55 9.67505C20.55 8.01819 19.2068 6.67505 17.55 6.67505C15.8931 6.67505 14.55 8.01819 14.55 9.67505C14.55 11.3319 15.8931 12.675 17.55 12.675Z"stroke=currentColor></path><path d="M14.025 18C14.025 14.625 11.325 11.925 7.95001 11.925C4.57501 11.925 1.95001 14.625 1.95001 18"stroke=currentColor></path><path d="M22.425 18.225C22.425 15.6 20.25 13.425 17.625 13.425C15.975 13.425 14.55 14.25 13.65 15.525"stroke=currentColor></path></svg> <span class=css-14ekiee>Board Members</span></div><p class="chakra-text css-68rnze"><span>Meet our independent board of directors with a proven track record</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=5507493a-c0aa-4888-80a2-9b846bc67194 class="chakra-link css-teg8ak"component=childRoutes href=/en/about-us/leadership-team icontext=leadership-team shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><g clip-path=url(#clip0_548_28706)><path d="M12.225 11.7C13.799 11.7 15.075 10.424 15.075 8.85C15.075 7.27599 13.799 6 12.225 6C10.651 6 9.375 7.27599 9.375 8.85C9.375 10.424 10.651 11.7 12.225 11.7Z"stroke=currentColor></path><path d="M18 18.075C18 14.925 15.45 12.3 12.225 12.3C9.00001 12.3 6.45001 14.85 6.45001 18.075"stroke=currentColor></path><path d="M20.25 14.4C21.1613 14.4 21.9 13.6612 21.9 12.75C21.9 11.8387 21.1613 11.1 20.25 11.1C19.3387 11.1 18.6 11.8387 18.6 12.75C18.6 13.6612 19.3387 14.4 20.25 14.4Z"stroke=currentColor></path><path d="M23.55 18.075C23.55 16.275 22.05 14.775 20.25 14.775C19.2 14.775 18.375 15.15 17.775 15.9"stroke=currentColor></path><path d="M4.35001 14.4C5.26128 14.4 6.00001 13.6612 6.00001 12.75C6.00001 11.8387 5.26128 11.1 4.35001 11.1C3.43874 11.1 2.70001 11.8387 2.70001 12.75C2.70001 13.6612 3.43874 14.4 4.35001 14.4Z"stroke=currentColor></path><path d="M6.75001 15.9C6.15001 15.225 5.25001 14.775 4.27501 14.775C2.47501 14.775 0.975006 16.275 0.975006 18.075"stroke=currentColor></path><path d="M12.825 17.55H11.475L11.925 13.95L12.825 12.525H11.55L12.45 13.95L12.825 17.55Z"stroke=currentColor></path></g><defs><clipPath id=clip0_548_28706><rect fill=currentColor height=24 width=24></rect></clipPath></defs></svg> <span class=css-14ekiee>Leadership Team</span></div><p class="chakra-text css-68rnze"><span>Meet our leadership team of prominent experts in the industry</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=f5522d10-f5d8-459f-a449-786c6c432eff class="chakra-link css-teg8ak"component=childRoutes href=/en/career icontext=careers shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M6.975 19.575H11.475V15.525H15.45V11.475H19.575V6.89996"stroke=currentColor></path><path d="M4.95 12.675L12.45 5.17499"stroke=currentColor></path><path d="M10.425 5.17499H12.45V7.19999"stroke=currentColor></path></svg> <span class=css-14ekiee>Careers</span></div><p class="chakra-text css-68rnze"><span>Find a career that aligns with your aspirations and values</span><span><br class=css-p8xzw6></span><span><br class=css-p8xzw6></span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=8a779aa3-a433-48f1-8aad-725733ffdc73 class="chakra-link css-teg8ak"component=childRoutes href=/en/about-us/our-locations icontext=office-locations shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M13.3 10.7H3.60001C3.30001 10.7 3.10001 10.5 3.10001 10.2V3.79999C3.10001 3.49999 3.30001 3.29999 3.60001 3.29999H13.3C13.6 3.29999 13.8 3.49999 13.8 3.79999V10.2C13.8 10.5 13.6 10.7 13.3 10.7Z"stroke=currentColor></path><path d="M3.10001 20.8V12.6C3.10001 12.6 3.10001 12.5 3.20001 12.5H22.2C22.2 12.5 22.3 12.5 22.3 12.6V20.7C22.3 20.7 22.3 20.8 22.2 20.8H13.9C13.9 20.8 13.8 20.8 13.8 20.7V16.2V12.5"stroke=currentColor></path><path d="M22.2 16.4H13.8"stroke=currentColor></path><path d="M10 12.5V10.7"stroke=currentColor></path><path d="M6.80002 12.5V10.7"stroke=currentColor></path><path d="M20 7.70001H17.2"stroke=currentColor></path><path d="M20 9.70001H17.2"stroke=currentColor></path></svg> <span class=css-14ekiee>Office Locations</span></div><p class="chakra-text css-68rnze"><span>Locate our seven licensed offices around the world</span></p></a></div></div></div>';
        const whatWeDoHTML = '<div bis_skin_checked=1 style=height:inherit;opacity:1;transform:none><div bis_skin_checked=1 class=css-1v2vw2c><div bis_skin_checked=1 class=css-phgwr1><a _uid=c450cb43-1e17-450d-b979-581f3f98dadf class="chakra-link css-teg8ak"component=childRoutes href=/en/what-we-offer icontext=what-we-offer shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M6.2 19.968H3.5V4.416H15.5V9.792"stroke=currentColor></path><path d="M8.4 7.392H6.7V9.024H8.4V7.392Z"fill=currentColor></path><path d="M12.2 7.392H10.5V9.024H12.2V7.392Z"fill=currentColor></path><path d="M8.4 11.232H6.7V12.864H8.4V11.232Z"fill=currentColor></path><path d="M8.4 14.976H6.7V16.608H8.4V14.976Z"fill=currentColor></path><path d="M12.5 16.32C13.6046 16.32 14.5 15.4604 14.5 14.4C14.5 13.3396 13.6046 12.48 12.5 12.48C11.3954 12.48 10.5 13.3396 10.5 14.4C10.5 15.4604 11.3954 16.32 12.5 16.32Z"stroke=currentColor></path><path d="M16.5 20.736C16.5 18.624 14.7 16.8 12.4 16.8C10.1 16.8 8.3 18.528 8.3 20.736"stroke=currentColor></path><path d="M17.8 16.32C18.9046 16.32 19.8 15.4604 19.8 14.4C19.8 13.3396 18.9046 12.48 17.8 12.48C16.6954 12.48 15.8 13.3396 15.8 14.4C15.8 15.4604 16.6954 16.32 17.8 16.32Z"stroke=currentColor></path><path d="M21.8 20.736C21.8 18.624 20 16.8 17.7 16.8C16.8 16.8 16 17.088 15.3 17.568"stroke=currentColor></path></svg> <span class=css-14ekiee>What We Offer</span></div><p class="chakra-text css-68rnze"><span>Discover our wide range of investment solutions and products</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=e4991c98-ae7d-4f19-bd6b-edaff60e02bc class="chakra-link css-teg8ak"component=childRoutes href=/en/what-we-offer/our-solutions icontext=tailored-portfolio-solutions shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M21.4 4.7V17.6H3.1V4.7"stroke=currentColor></path><path d="M1.2 4.7H22.8"stroke=currentColor></path><path d="M14 9.4H19.1"stroke=currentColor></path><path d="M14 12.8H19.1"stroke=currentColor></path><path d="M12.4 17.6V20.3"stroke=currentColor></path><path d="M12.3 11.3H9.1V8C7.3 8 5.9 9.4 5.9 11.2C5.9 13 7.3 14.4 9.1 14.4C10.9 14.4 12.3 13 12.3 11.3Z"stroke=currentColor></path></svg> <span class=css-14ekiee>Tailored Portfolio Solutions</span></div><p class="chakra-text css-68rnze"><span>Align your goals with your risk tolerance and time horizon</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=35169e48-ccb1-452f-a9f6-395eafa05fdc class="chakra-link css-teg8ak"component=childRoutes href=/en/direct-private-market-funds icontext=directive-investments shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M7.60001 17.7H2.70001C2.60001 17.7 2.60001 17.7 2.60001 17.6V4.5C2.60001 4.4 2.60001 4.4 2.70001 4.4H21.7C21.8 4.4 21.8 4.4 21.8 4.5V11"stroke=currentColor></path><path d="M13.8 8.2V15.4V16.5L10.9 15C9.10001 17.4 14.6 20.8 14.6 20.8H21.7V13.6"stroke=currentColor></path><path d="M16.4 11.4V14.4"stroke=currentColor></path><path d="M19.1 12.5V14.9"stroke=currentColor></path><path d="M21.7 15.4L14 14"stroke=currentColor></path></svg> <span class=css-14ekiee>Direct Investments in Private Markets</span></div><p class="chakra-text css-68rnze"><span>Diversify your risk and return exposure with private equity</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=c3c0c597-1b96-41be-b9f7-7adc22875e78 class="chakra-link css-teg8ak"component=childRoutes href=/en/invest-now-pay-later icontext=inpl shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M9.49999 20.8C9.09999 20.7 8.69999 20.5 8.29999 20.4C7.79999 20.2 7.29999 19.9 6.89999 19.6"stroke=currentColor></path><path d="M3.60001 7.80001C5.20001 4.70001 8.30001 2.60001 12 2.60001C17.1 2.60001 21.3 6.80001 21.3 11.9C21.3 17 17.1 21.2 12 21.2"stroke=currentColor></path><path d="M3 14.4C2.8 13.6 2.7 12.8 2.7 11.9"stroke=currentColor></path><path d="M5.20001 18.3C4.60001 17.6 4.00001 16.8 3.60001 16"stroke=currentColor></path><path d="M5.89999 7.2L3.49999 7.8L2.89999 5.3"stroke=currentColor></path><path d="M9.9 13.6C9.9 14.5 10.8 15.5 12.1 15.5C13.4 15.5 14.3 14.6 14.3 13.8C14.3 13 13.5 12.3 12.4 11.8C12.4 11.8 11.8 11.6 11.7 11.5C10.6 11 9.8 10.4 9.8 9.5C9.8 8.6 10.7 7.8 12 7.8C13.3 7.8 14.2 8.7 14.2 9.7"stroke=currentColor></path><path d="M11.9 7.7V6.7"stroke=currentColor></path><path d="M12.1 15.5V16.5"stroke=currentColor></path></svg> <span class=css-14ekiee>Invest Now Pay Later</span></div><p class="chakra-text css-68rnze"><span>Fund your portfolio with a flexible payment plan</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=99177b83-ef51-46b4-b68d-71d8c9109f60 class="chakra-link css-teg8ak"component=childRoutes href=/en/what-we-offer/digital-platform icontext=digital-investments-platform shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M21.8 17.7H2.2C2.1 17.7 2 17.6 2 17.5V3.9C2 3.8 2.1 3.7 2.2 3.7H21.9C22 3.7 22.1 3.8 22.1 3.9V17.5C22.1 17.6 22 17.7 21.8 17.7Z"stroke=currentColor></path><path d="M15 21.1V17.7"stroke=currentColor></path><path d="M8.8 21.1V17.7"stroke=currentColor></path><path d="M15 10.4C15.9941 10.4 16.8 9.59412 16.8 8.6C16.8 7.60589 15.9941 6.8 15 6.8C14.0059 6.8 13.2 7.60589 13.2 8.6C13.2 9.59412 14.0059 10.4 15 10.4Z"stroke=currentColor></path><path d="M18.7 15C18.7 12.9 17 11.3 15 11.3C13 11.3 11.2 13 11.2 15"stroke=currentColor></path><path d="M8.3 9.10001H4"stroke=currentColor></path><path d="M8.3 12.2H4"stroke=currentColor></path></svg> <span class=css-14ekiee>Digital Investment Platform</span></div><p class="chakra-text css-68rnze"><span>Access private market opportunities and build your portfolio</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=74ff4c52-e28e-4d5e-a123-3e1262309d25 class="chakra-link css-teg8ak"component=childRoutes href=/en/secondary-marketplace icontext=market-place shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M3.79999 14V20C3.79999 20.1 3.89999 20.2 3.99999 20.2H18.3C18.4 20.2 18.5 20.1 18.5 20V14"stroke=currentColor></path><path d="M18.1 7.1V4.7C18.1 4.6 18 4.5 17.9 4.5H4.39999C4.19999 4.4 4.09999 4.5 4.09999 4.7V7.2C4.09999 7.2 4.09999 7.2 4.09999 7.3L2.29999 13.5C2.29999 13.6 2.39999 13.8 2.49999 13.8H20C20.2 13.8 20.3 13.6 20.2 13.5L18.1 7.1Z"stroke=currentColor></path><path d="M6.40001 7.8C6.84183 7.8 7.20001 7.44182 7.20001 7C7.20001 6.55817 6.84183 6.2 6.40001 6.2C5.95818 6.2 5.60001 6.55817 5.60001 7C5.60001 7.44182 5.95818 7.8 6.40001 7.8Z"fill=currentColor></path><path d="M8.69999 7.8C9.14182 7.8 9.49999 7.44182 9.49999 7C9.49999 6.55817 9.14182 6.2 8.69999 6.2C8.25817 6.2 7.89999 6.55817 7.89999 7C7.89999 7.44182 8.25817 7.8 8.69999 7.8Z"fill=currentColor></path></svg> <span class=css-14ekiee>The Marketplace</span></div><p class="chakra-text css-68rnze">Control your illiquid asset by buying and selling deals</p></a></div></div></div>';
        const financialToolsHTML = '<div bis_skin_checked=1 style=height:inherit;opacity:1;transform:none><div bis_skin_checked=1 class=css-1v2vw2c><div bis_skin_checked=1 class=css-phgwr1><a _uid=60f2386d-dc3e-47f1-8954-9e82c87341d5 class="chakra-link css-teg8ak"component=childRoutes href=/en/financial-tools icontext=financial-overview shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M9.29999 21.5H4.39999V3.5H18.6V9.8"stroke=currentColor></path><path d="M17.2 21.5C19.133 21.5 20.7 19.933 20.7 18C20.7 16.067 19.133 14.5 17.2 14.5C15.267 14.5 13.7 16.067 13.7 18C13.7 19.933 15.267 21.5 17.2 21.5Z"stroke=currentColor></path><path d="M21.5 22.3L19.7 20.6"stroke=currentColor></path><path d="M17.2 14.5V18H13.7"stroke=currentColor></path><path d="M7.5 8.59998H15.5"stroke=currentColor></path><path d="M7.5 12.5H11.9"stroke=currentColor></path><path d="M7.5 16.4H9.6"stroke=currentColor></path></svg> <span class=css-14ekiee>Overview</span></div><p class="chakra-text css-68rnze"><span>Discover everything you need to help you start investing</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=3e1b28b8-4de1-4bd4-a312-5e7d15b62d7c class="chakra-link css-teg8ak"component=childRoutes href=/en/financial-tools/portfolio-builder icontext=portfolio-builder shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M17.2 20H9.6C9.5 20 9.4 19.9 9.4 19.8L8.4 13.4H18.4L17.4 19.8C17.4 19.9 17.3 20 17.2 20Z"stroke=currentColor></path><path d="M6.5 13.4H20"stroke=currentColor></path><path d="M12.1 9.50006C13 5.90006 4.7 7.00006 4.7 7.00006C6.7 8.80006 7.6 12.1001 10.1 11.5001C11 11.3001 11.8 10.5001 12.1 9.50006Z"stroke=currentColor></path><path d="M11.6 10.3C11.6 10.3 13.4 11.3 13.8 13.7"stroke=currentColor></path><path d="M16 8.8C16 9.3 16.5 9.8 17.2 9.8C17.9 9.8 18.4 9.3 18.4 8.8C18.4 8.3 18 8 17.4 7.7C17.4 7.7 17.1 7.6 17 7.6C16.4 7.3 15.9 7 15.9 6.5C15.9 6 16.4 5.5 17.1 5.5C17.8 5.5 18.3 6 18.3 6.5"stroke=currentColor></path><path d="M17.1 5.5V5"stroke=currentColor></path><path d="M17.2 9.80005V10.4"stroke=currentColor></path></svg> <span class=css-14ekiee>Portfolio Builder</span></div><p class="chakra-text css-68rnze"><span>Plan the right portfolio that meets your financial needs</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=6a415a97-a522-445f-b28c-d474ddefd823 class="chakra-link css-teg8ak"component=childRoutes href=/en/financial-tools/diversification-calculator icontext="diversification -calculator"shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M18.8 4.40002H12.7V10.5H18.8V4.40002Z"stroke=currentColor></path><path d="M5.79999 10.5C4.09999 10.5 2.79999 9.1 2.79999 7.5C2.79999 5.8 4.19999 4.5 5.79999 4.5C7.49999 4.5 8.79999 5.9 8.79999 7.5C8.79999 9.1 7.49999 10.5 5.79999 10.5Z"stroke=currentColor></path><path d="M8.79999 19.6H2.79999L5.79999 13.5L8.79999 19.6Z"stroke=currentColor></path><path d="M17.4 19.6H13.2L12 15.7L15.3 13.2L18.5 15.7L17.4 19.6Z"stroke=currentColor></path></svg> <span class=css-14ekiee>Diversification Calculator</span></div><p class="chakra-text css-68rnze"><span>Check if your investments are diversified enough to mitigate risk</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=77423fc7-0212-475f-ac5f-a7fa3b552367 class="chakra-link css-teg8ak"component=childRoutes href=/en/financial-tools/retirement-calculator icontext=retirement-calculator shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M3.60001 13.6C3.60001 13.6 4.20001 20.3 11.6 21.2C11.6 21.2 12 15.5 3.60001 13.6Z"stroke=currentColor></path><path d="M20.4 13.6C20.4 13.6 19.8 20.3 12.4 21.2C12.4 21.2 12 15.5 20.4 13.6Z"stroke=currentColor></path><path d="M12 13.9C9.60001 13.9 7.60001 12.2 7.60001 10.2C7.60001 8.79995 7.90001 7.39995 8.50001 6.09995L9.00001 5.19995L10.5 6.79995L12 5.19995L13.6 6.79995L15.2 5.19995L15.7 6.29995C16.2 7.49995 16.5 8.69995 16.5 9.99995V10.2C16.4 12.2 14.4 13.9 12 13.9Z"stroke=currentColor></path><path d="M12 21.2V13.9"stroke=currentColor></path></svg> <span class=css-14ekiee>Retirement Calculator</span></div><p class="chakra-text css-68rnze"><span>Project your retirement income and plan for a secure retirement</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=abaa3359-89fc-464c-92c6-88d988954605 class="chakra-link css-teg8ak"component=childRoutes href=/en/financial-tools/risk-profiler icontext=risk-profiler shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M12.8 21.9C4 18.9 4.5 7.79995 4.6 6.09995C4.6 5.99995 4.7 5.79995 4.8 5.79995L12.8 1.89995C12.9 1.79995 13 1.79995 13.1 1.89995L21 5.79995C21.1 5.89995 21.2 5.99995 21.2 6.09995C21.2 7.89995 21.2 19.1 13 21.9C13 22 12.9 22 12.8 21.9Z"stroke=currentColor></path><path d="M13.4 7L9.4 13H12.4V17L16.4 11H13.4V7Z"fill=currentColor></path></svg> <span class=css-14ekiee>Risk Profiler</span></div><p class="chakra-text css-68rnze"><span>Understand your risk profile to optimize your investments</span></p></a></div></div></div>';
        const insightsHTML = '<div bis_skin_checked=1 style=height:inherit;opacity:1;transform:none><div bis_skin_checked=1 class=css-1v2vw2c><div bis_skin_checked=1 class=css-phgwr1><a _uid=cc002cd2-cfcb-49b4-aa0f-f3b935eedda9 class="chakra-link css-teg8ak"component=childRoutes href=/en/insights icontext=insights-overview shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M8.60094 21.7998H4V3.3999H17.3333V9.83986"stroke=currentColor></path><path d="M16 21.7998C17.841 21.7998 19.3333 20.188 19.3333 18.1998C19.3333 16.2116 17.841 14.5999 16 14.5999C14.1591 14.5999 12.6667 16.2116 12.6667 18.1998C12.6667 20.188 14.1591 21.7998 16 21.7998Z"stroke=currentColor></path><path d="M20 22.6L18.6667 21"stroke=currentColor></path><path d="M16 14.5999V18.5998H12.6667"stroke=currentColor></path><path d="M7.33333 9H14.6667"stroke=currentColor></path><path d="M7.33333 12.9998H11.3333"stroke=currentColor></path><path d="M7.33333 17H9.33333"stroke=currentColor></path></svg> <span class=css-14ekiee>Overview</span></div><p class="chakra-text css-68rnze"><span>Stay up to date with industry insights and market trends</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=e2d89937-8edb-478d-8444-daae872d1af4 class="chakra-link css-teg8ak"component=childRoutes href=/en/insights/webinars icontext=webinars shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M20.6 19.9001H2.6V8.1001H20.6V19.9001ZM20.6 19.9001C20.7 19.9001 20.7 19.9001 20.6 19.9001Z"stroke=currentColor></path><path d="M7.4 6.89995C7.4 6.49995 7.7 6.19995 8.1 6.19995H15.2C15.6 6.19995 15.9 6.49995 15.9 6.89995"stroke=currentColor></path><path d="M10.3 14V11.7L12.3 12.9L14.2 14L12.3 15.1L10.3 16.3V14Z"stroke=currentColor></path></svg> <span class=css-14ekiee>Webinars</span></div><p class="chakra-text css-68rnze"><span>Learn more about market trends and outlooks from experts</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=8d45bfeb-9457-4e5d-8e1a-9d3f30fd9a3c class="chakra-link css-teg8ak"component=childRoutes href=/en/insights/management-views icontext=management-views shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M20.8 15.9H7.1C7 15.9 7 15.8 7 15.8V4.29995C7 4.19995 7.1 4.19995 7.1 4.19995H20.8C20.9 4.19995 20.9 4.29995 20.9 4.29995V15.8C21 15.9 20.9 15.9 20.8 15.9Z"stroke=currentColor></path><path d="M18.1 17.3C18.1 18.1 17.4 18.8 16.6 18.8H4.20001C4.10001 18.8 4.10001 18.7 4.10001 18.7V8.6C4.10001 7.7 4.80001 7 5.60001 7"stroke=currentColor></path><path d="M7 8H21"stroke=currentColor></path><path d="M14.1 12H18.2"stroke=currentColor></path><path d="M10.1 12H12.1"stroke=currentColor></path></svg> <span class=css-14ekiee>Management Views</span></div><p class="chakra-text css-68rnze"><span>Watch interviews about market and management insights</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=d2918c77-3d3b-43b7-b3b1-7bf19fc97c53 class="chakra-link css-teg8ak"component=childRoutes href=/en/insights/articles icontext=articles shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M4.60001 21.5V3.5H17.8V21.5H4.60001Z"stroke=currentColor></path><path d="M7.2 7.5H15.2"stroke=currentColor></path><path d="M7.2 17.5999C7.2 17.5999 9.6 16.9999 10.6 15.0999C11.6 13.1999 10.6 11.3999 9.7 11.3999C8.8 11.3999 7.4 13.0999 8.5 15.1999C9.6 17.2999 10.3 17.5999 11.3 17.6999C12.3 17.7999 13.7 15.1999 14.2 15.1999C14.7 15.1999 12.9 18.1999 14.8 18.1999"stroke=currentColor></path></svg> <span class=css-14ekiee>Articles</span></div><p class="chakra-text css-68rnze"><span>Read our series of educational articles about private markets</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=9775d1de-60c4-4ad0-ae2f-2db6bb216212 class="chakra-link css-teg8ak"component=childRoutes href=/en/insights/market-outlook icontext=market-outlook shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M3.9 20.6001V16.6001"stroke=currentColor></path><path d="M7.9 20.6001V14.6001"stroke=currentColor></path><path d="M11.9 20.6001V12.6001"stroke=currentColor></path><path d="M15.9 20.6001V16.6001"stroke=currentColor></path><path d="M19.9 20.6001V16.6001"stroke=currentColor></path><path d="M3.3 11.9999L9.4 5.8999"stroke=currentColor></path><path d="M5.2 5.69995H9.6V10.1"stroke=currentColor></path><path d="M15.8 10.5C15.8 11.4 16.7 12.2 17.9 12.2C19.1 12.2 20 11.4 20 10.6C20 9.8 19.3 9.2 18.2 8.7C18.2 8.7 17.7 8.5 17.5 8.5C16.4 8.1 15.7 7.4 15.7 6.6C15.7 5.8 16.6 5 17.8 5C19 5 19.9 5.9 19.9 6.7"stroke=currentColor></path><path d="M17.7 4.9V4"stroke=currentColor></path><path d="M17.8 12.2V13.2"stroke=currentColor></path></svg> <span class=css-14ekiee>Market Outlook</span></div><p class="chakra-text css-68rnze"><span>Get monthly and quarterly market evaluations</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=92690142-a4cc-4356-9c5d-9e6f35b4f5c3 class="chakra-link css-teg8ak"component=childRoutes href=/en/insights/press-release icontext=press-release shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M18.1 3.8999H3.89999V20.0999H18.1V3.8999Z"stroke=currentColor></path><path d="M22 3.8999V19.9999C22 20.0999 22 20.0999 21.9 20.0999H18"stroke=currentColor></path><path d="M14.7 8.5H7.39999"stroke=currentColor stroke-width=2></path><path d="M14.9 13H6.89999"stroke=currentColor></path><path d="M14.9 17H6.89999"stroke=currentColor></path></svg> <span class=css-14ekiee>Press Release</span></div><p class="chakra-text css-68rnze"><span>Discover the latest news about The Family Office</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=97b7753a-244e-47d1-831a-a47eca1c3ecb class="chakra-link css-teg8ak"component=childRoutes href=/en/insights/knowledge-hub icontext=knowledge-hub shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M21 12.3V17H2.89999V5H7.59999"stroke=currentColor></path><path d="M10.6 2.70009L17.4 3.50009C17.5 3.50009 17.7 3.60009 17.8 3.70009L22 8.50009C22.3 8.90009 22 9.50009 21.5 9.40009L14.8 8.80009C14.7 8.80009 14.5 8.70009 14.4 8.60009L10.1 3.70009C9.7 3.30009 10.1 2.60009 10.6 2.70009Z"stroke=currentColor></path><path d="M11 8.1001L10.2 9.6001L12.8 11.9001L16.4 12.7001L17.1 11.3001C14.9 10.7001 12.8 9.7001 11 8.1001Z"stroke=currentColor></path><path d="M8 19.1001H16"stroke=currentColor></path></svg> <span class=css-14ekiee>Knowledge Hub</span></div><p class="chakra-text css-68rnze"><span>Explore advanced strategies to grow wealth and hedge risks</span></p></a></div><div bis_skin_checked=1 class=css-phgwr1><a _uid=da4b6e66-ed01-44d4-b948-c93a49726ba1 class="chakra-link css-teg8ak"component=childRoutes href=/en/insights/whitepaper icontext=whitepapers shortdescription="[object Object]"><div bis_skin_checked=1 class=css-1mm0rzc><svg class="chakra-icon css-ytc1zr"focusable=false viewBox="0 0 24 24"><path d="M14.3 21.3001H5.1V3.1001H19.3V15.9001L14.3 21.3001Z"stroke=currentColor></path><path d="M19.3 15.8999H14.3V21.2999"stroke=currentColor></path></svg> <span class=css-14ekiee>Whitepapers</span></div><p class="chakra-text css-68rnze"><span>Read comprehensive analyses about market trends</span></p></a></div></div></div>';

        self.appendDropdownContent(whoWeAre, whoWeAreHTML);
        self.appendDropdownContent(whatWeDo, whatWeDoHTML);
        self.appendDropdownContent(financialTools, financialToolsHTML);
        self.appendDropdownContent(insights, insightsHTML);
    };

    self.appendDropdownContent = (button, buttonHTML) => {
        const { navbar, accordionItem, accordionPanel } = selectors;

        Insider.dom(navbar).find(button).closest(accordionItem).find(accordionPanel).append(buttonHTML);
    };

    self.setEvents = () => {
        const { accordionItem, expanded: expandedSelector, collapsible, navbar,
            anchorActive: anchorActiveSelector, firstChakraLink, buttonTag, dropdownLinks, visiblePanel,
            navbarButtons, login } = selectors;
        const { expanded, navbarPassive, navbarActive, anchorActive, anchorPassive } = classes;

        const $allButtons = Insider.dom(navbarButtons);
        const $navbar = Insider.dom(navbar);
        const $window = Insider.dom(window);

        Insider.eventManager.once(`click.track:accordion:item:clicks:${ variationId }`, accordionItem, (event) => {
            const $accordion = Insider.dom(event.target).closest(accordionItem);
            const $collapsible = $accordion.find(collapsible);
            const $link = $accordion.find(firstChakraLink);
            const $button = $accordion.find(buttonTag);
            const $loginButton = $accordion.find(login);
            const $anchorActiveSelector = Insider.dom(anchorActiveSelector);
            const $expandedSelector = Insider.dom(expandedSelector);

            if ($collapsible.hasClass(expanded)) {
                $expandedSelector.removeClass(expanded);

                $link.removeClass(anchorActive).addClass(anchorPassive);
                $navbar.removeClass(navbarActive).addClass(navbarPassive);
                $loginButton.addClass(anchorPassive);
                $loginButton.toggleClass(anchorActive);

                self.animateDropdown($collapsible, 'none', 0);
                self.setAriaExpanded($button, 'false');
            } else {
                $anchorActiveSelector.removeClass(anchorActive).addClass(anchorPassive);
                $navbar.addClass(navbarActive).removeClass(navbarPassive);
                $expandedSelector.removeClass(expanded);
                $collapsible.addClass(expanded);
                $link.removeClass(anchorPassive).addClass(anchorActive);
                $loginButton.toggleClass(anchorActive);

                if ($loginButton.length && Insider.systemRules.call('isOnMainPage')) {
                    $navbar.removeClass(navbarActive).addClass(navbarPassive);
                }

                self.animateDropdownLinkAnimation(false);
                self.setAriaExpanded($allButtons, 'false');
                self.setAriaExpanded($button, 'true');
                self.animateDropdown(collapsible, 'none', 0);
                self.animateDropdown($collapsible, 'block', 1);
            }
        });

        Insider.eventManager.once(`click.track:clicks:on:links:${ variationId }`, dropdownLinks, (event) => {
            window.location.href = Insider.dom(event.target).closest('a').attr('href');
        });

        Insider.eventManager.once(`scroll.track:scroll:height:${ variationId }`, window, Insider.fns.throttle(() => {
            if ($window.scrollTop() >= 200) {
                $navbar.removeClass(navbarPassive).addClass(navbarActive);
            } else {
                if (!Insider.dom(visiblePanel).length > 0) {
                    $navbar.removeClass(navbarActive).addClass(navbarPassive);
                }
            }
        }, 100));

        Insider.eventManager.once(`click.track:window:clicks:${ variationId }`, window, (event) => {
            event.preventDefault();

            const $buttons = Insider.dom(navbarButtons);
            const $anchorActiveSelector = Insider.dom(anchorActiveSelector);
            const $expandedSelector = Insider.dom(expandedSelector);

            if (Insider.dom(event.target).closest(accordionItem).length < 1 && Insider.dom(visiblePanel).length > 0) {
                $anchorActiveSelector.removeClass(anchorActive).addClass(anchorPassive);
                $expandedSelector.removeClass(expanded);

                self.setAriaExpanded($buttons, 'false');
                self.animateDropdown(collapsible, 'none', 0);

                if ($window.scrollTop() < 200) {
                    $navbar.removeClass(navbarActive).addClass(navbarPassive);
                }
            }
        });
    };

    self.animateDropdown = (dropdown, displayType, opacity) => {
        Insider.dom(dropdown).css('display', displayType).animate({
            opacity,
            height: 'toggle'
        }, 200);

        setTimeout(() => {
            self.animateDropdownLinkAnimation(opacity === 1);
        }, 200);
    };

    self.setAriaExpanded = (element, value) => {
        element.attr('aria-expanded', value);
    };

    self.animateDropdownLinkAnimation = (boolean) => {
        const { navbar, animatedDropdownLinks } = selectors;
        const translateValue = boolean ? 'translateY(0%)' : 'translateY(-20%)';

        Insider.dom(navbar).find(animatedDropdownLinks).css('transform', translateValue, 'important');
    };

    return self.init();
})({});
/* OPT-162734 END */
