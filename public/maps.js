/* Browser-restricted Google Maps key only; never put a server credential here. */
(() => {
  let placesLibrary, mapsLibrary, markerLibrary;
  function message(element, text) { element.textContent = text; }

  function attachAddress(input, form) {
    if (!input || input.dataset.googleAttached) return;
    input.dataset.googleAttached = 'true';
    const holder = document.createElement('div');
    holder.className = 'google-address-search';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.textContent = 'Tìm địa chỉ trên Google';
    const panel = document.createElement('div');
    panel.hidden = true;
    const feedback = document.createElement('p');
    feedback.className = 'google-address-feedback';
    feedback.setAttribute('role', 'status');
    holder.append(toggle, panel, feedback);
    input.parentElement.append(holder);
    let widget;
    toggle.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      if (widget) return;
      widget = new placesLibrary.PlaceAutocompleteElement({ includedRegionCodes: ['vn'] });
      panel.append(widget);
      widget.addEventListener('gmp-error', () => message(feedback, 'Không tải được gợi ý Google. Bạn vẫn có thể nhập địa chỉ bên trên.'));
      widget.addEventListener('gmp-select', async ({ placePrediction }) => {
        try {
          const place = placePrediction.toPlace();
          await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
          input.value = form ? (place.formattedAddress || place.displayName) : place.displayName;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          if (form && place.location) {
            form.elements.latitude.value = place.location.lat();
            form.elements.longitude.value = place.location.lng();
            let preview = holder.querySelector('.google-map-preview');
            if (!preview) { preview = document.createElement('div'); preview.className = 'google-map-preview'; holder.append(preview); }
            renderMap(preview, place.location);
          }
          message(feedback, `Đã chọn: ${place.formattedAddress || place.displayName}`);
          panel.hidden = true;
        } catch { message(feedback, 'Không lấy được địa chỉ. Vui lòng chọn lại hoặc nhập thủ công.'); }
      });
    });
  }

  function renderMap(element, position) {
    const map = new mapsLibrary.Map(element, { center: position, zoom: 16, mapId: 'DEMO_MAP_ID', streetViewControl: false, mapTypeControl: false });
    new markerLibrary.AdvancedMarkerElement({ map, position });
  }

  function attach() {
    attachAddress(document.querySelector('#location'), null);
    const form = document.querySelector('#listing-form');
    if (form) attachAddress(form.elements.location, form);
    document.querySelectorAll('iframe.listing-map').forEach(frame => {
      const marker = new URL(frame.src).searchParams.get('marker');
      if (!marker) return;
      const [lat, lng] = marker.split(',').map(Number);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const container = document.createElement('div');
      container.className = 'listing-map';
      container.setAttribute('aria-label', 'Vị trí bất động sản trên Google Maps');
      frame.replaceWith(container);
      renderMap(container, { lat, lng });
    });
  }

  async function initialize() {
    try {
      const response = await fetch('/api/maps-config');
      if (!response.ok) return;
      const { browserKey } = await response.json();
      if (!browserKey) return; // Keep manual address entry when unconfigured.
      await new Promise((resolve, reject) => {
        window.initAnCuMaps = resolve;
        const script = document.createElement('script');
        const params = new URLSearchParams({ key: browserKey, loading: 'async', callback: 'initAnCuMaps', language: 'vi', region: 'VN', v: 'weekly' });
        script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
        script.async = true;
        script.onerror = reject;
        document.head.append(script);
      });
      [placesLibrary, mapsLibrary, markerLibrary] = await Promise.all(['places', 'maps', 'marker'].map(name => google.maps.importLibrary(name)));
      attach();
      new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
    } catch { console.warn('Google Maps chưa khả dụng. Có thể tiếp tục nhập địa chỉ thủ công.'); }
  }
  initialize();
})();
