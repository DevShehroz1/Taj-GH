jQuery_T4NT(document).ready(function($) {

     /**
     *  Variant selection changed
     *  data-variant-toggle="{{ variant.id }}"
     */
	   $( document ).on( "variant:changed", function( evt ) {
	     // console.log( evt.currentVariant );
	     // $('[data-variant-toggle]').hide(0);
	     // $('[data-variant-toggle="'+evt.currentVariant.id+'"]').show(0);
	   });
});

/* ==========================================================================
   YSL-STYLE PRODUCT PAGE — Mobile drawer + button text
   ========================================================================== */
(function() {
  'use strict';

  var mql = window.matchMedia('(max-width: 767px)');
  if (!mql.matches) return;

  var mainProduct = document.querySelector('.t4s-section-main-product');
  if (!mainProduct) return;

  /* ---- 1. Change ATC text to "BUY IT NOW" ---- */
  var atcText = mainProduct.querySelector('.t4s-btn-atc_text');
  if (atcText && atcText.textContent.trim().toLowerCase() !== 'sold out') {
    atcText.textContent = 'BUY IT NOW';
  }

  var variantObserver = new MutationObserver(function() {
    var el = mainProduct.querySelector('.t4s-btn-atc_text');
    if (el) {
      var txt = el.textContent.trim().toLowerCase();
      if (txt !== 'sold out' && txt !== 'pre-order' && txt !== 'buy it now') {
        el.textContent = 'BUY IT NOW';
      }
    }
  });
  var formBtns = mainProduct.querySelector('.t4s-product-form__buttons');
  if (formBtns) {
    variantObserver.observe(formBtns, { childList: true, subtree: true, characterData: true });
  }

  /* ---- 2. Hide delivery & ask links (replaced by drawer links) ---- */
  var extraLinks = mainProduct.querySelectorAll('.t4s-extra-link .t4s-ch');
  for (var i = 0; i < extraLinks.length; i++) {
    var dataId = extraLinks[i].getAttribute('data-id');
    if (dataId === 't4s-pr-popup__delivery' || dataId === 't4s-pr-popup__contact') {
      extraLinks[i].style.display = 'none';
    }
  }

  /* ---- 3. Create drawer overlay ---- */
  var overlay = document.createElement('div');
  overlay.className = 'ysl-drawer-overlay';
  document.body.appendChild(overlay);

  /* ---- 4. Create drawer ---- */
  var drawer = document.createElement('div');
  drawer.className = 'ysl-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.innerHTML =
    '<div class="ysl-drawer__header">' +
      '<h2 class="ysl-drawer__title"></h2>' +
      '<button class="ysl-drawer__close" type="button" aria-label="Close">' +
        '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="ysl-drawer__body"></div>';
  document.body.appendChild(drawer);

  var drawerTitle = drawer.querySelector('.ysl-drawer__title');
  var drawerBody = drawer.querySelector('.ysl-drawer__body');
  var scrollPos = 0;

  function openDrawer(title, html) {
    drawerTitle.textContent = title;
    drawerBody.innerHTML = html;
    scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    document.body.classList.add('ysl-no-scroll');
    document.body.style.top = -scrollPos + 'px';
    requestAnimationFrame(function() {
      overlay.classList.add('is-open');
      drawer.classList.add('is-open');
    });
  }

  function closeDrawer() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    setTimeout(function() {
      document.body.classList.remove('ysl-no-scroll');
      document.body.style.top = '';
      window.scrollTo(0, scrollPos);
    }, 400);
  }

  drawer.querySelector('.ysl-drawer__close').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  /* ---- 5. Gather tab content for "MORE DETAILS" drawer ---- */
  var detailsHtml = '';
  var tabWrapper = document.querySelector('.t4s-product-tabs-wrapper');

  if (tabWrapper) {
    var tabWrappers = tabWrapper.querySelectorAll('[data-t4s-tab-wrapper]');
    var isFirst = true;

    for (var t = 0; t < tabWrappers.length; t++) {
      var tw = tabWrappers[t];
      var headingEl = tw.querySelector('[data-t4s-tab-item]');
      var contentEl = tw.querySelector('[data-t4s-tab-content]');

      if (!contentEl) continue;
      var cHtml = contentEl.innerHTML ? contentEl.innerHTML.trim() : '';
      if (!cHtml) continue;

      var tabTitle = '';
      if (headingEl) {
        var textSpan = headingEl.querySelector('.t4s-tab__text');
        tabTitle = textSpan ? textSpan.textContent.trim() : headingEl.textContent.trim();
      }

      if (tabTitle.toLowerCase().indexOf('review') !== -1) continue;

      if (isFirst) {
        detailsHtml += cHtml;
        isFirst = false;
      } else {
        detailsHtml +=
          '<div class="ysl-drawer__collapse">' +
            '<button class="ysl-drawer__collapse-toggle" type="button">' +
              '<span>' + tabTitle.toUpperCase() + '</span>' +
              '<svg class="ysl-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>' +
            '</button>' +
            '<div class="ysl-drawer__collapse-body">' + cHtml + '</div>' +
          '</div>';
      }
    }
  }

  if (!detailsHtml) {
    var descEl = mainProduct.querySelector('.t4s-product__description');
    if (descEl) detailsHtml = descEl.innerHTML;
  }

  /* ---- 6. Create "MORE DETAILS" + "CONTACT US" links ---- */
  var linksDiv = document.createElement('div');
  linksDiv.className = 'ysl-drawer-links';

  var moreBtn = document.createElement('button');
  moreBtn.className = 'ysl-drawer-link';
  moreBtn.type = 'button';
  moreBtn.textContent = 'MORE DETAILS';
  moreBtn.addEventListener('click', function() {
    openDrawer('DETAILS', detailsHtml || '<p>No additional details available.</p>');
  });

  var contactBtn = document.createElement('button');
  contactBtn.className = 'ysl-drawer-link';
  contactBtn.type = 'button';
  contactBtn.textContent = 'CONTACT US';
  contactBtn.addEventListener('click', function() {
    var askLink = mainProduct.querySelector('.t4s-extra-link [data-id="t4s-pr-popup__contact"]');
    if (askLink) {
      askLink.click();
    } else {
      openDrawer('CONTACT US',
        '<p>For questions about this product, please email us at ' +
        '<a href="mailto:info@tajofficial.com" style="color:#000;text-decoration:underline;">info@tajofficial.com</a>' +
        '</p>'
      );
    }
  });

  linksDiv.appendChild(moreBtn);
  linksDiv.appendChild(contactBtn);

  /* ---- 7. Insert drawer links after the form ---- */
  var infoContainer = mainProduct.querySelector('.t4s-product__info-container');
  if (infoContainer) {
    var formEl = infoContainer.querySelector('[id^="t4s-callBackVariant"]');
    if (formEl) {
      if (formEl.nextSibling) {
        formEl.parentNode.insertBefore(linksDiv, formEl.nextSibling);
      } else {
        formEl.parentNode.appendChild(linksDiv);
      }
    } else {
      infoContainer.appendChild(linksDiv);
    }
  }

  /* ---- 8. Collapsible sections inside the drawer ---- */
  document.addEventListener('click', function(e) {
    var toggle = e.target.closest('.ysl-drawer__collapse-toggle');
    if (!toggle) return;
    toggle.classList.toggle('is-open');
    var collapseBody = toggle.nextElementSibling;
    if (collapseBody) collapseBody.classList.toggle('is-open');
  });

})();
