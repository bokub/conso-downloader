(function () {
  'use strict';

  const PATTERN = /donnees-energetiques\?mesuresTypeCode=COURBE&mesuresCorrigees=false&typeDonnees=(CONS|PROD)/;
  const MAX_DOWNLOADS = 150;

  let capturedUrl = null;
  let isProd = null;
  let downloadButton = null;
  let isDownloading = false;

  const buttonColor = 'linear-gradient(to right, #3b82f6, #06b6d4)';

  function createDownloadButton() {
    if (downloadButton) {
      return;
    }

    const form = document.querySelector('filtres form');
    if (!form) {
      console.log('⏳ Attente formulaire...');
      setTimeout(createDownloadButton, 2000);
      return;
    }

    downloadButton = document.createElement('button');
    downloadButton.type = 'button';
    downloadButton.textContent = 'Télécharger tout mon historique';
    downloadButton.disabled = true;
    downloadButton.style.cssText = `
      width: 100%;
      padding: 14px 16px 15px;
      background-image: linear-gradient(#aaa);
      color: #fff;
      border: none;
      font-size: 16px;
      font-weight: bold;
      cursor: not-allowed;
      border-radius: 4px;
      transition: background-image 0.2s;
    `;

    downloadButton.onmouseover = () => {
      if (!downloadButton.disabled) {
        downloadButton.style.opacity = '0.8';
      }
    };
    downloadButton.onmouseout = () => {
      if (!downloadButton.disabled) {
        downloadButton.style.opacity = '1';
      }
    };

    downloadButton.onclick = handleDownload;

    form.appendChild(downloadButton);
    console.log('✅ Bouton de téléchargement ajouté');
  }

  async function handleDownload() {
    if (isDownloading || !capturedUrl) {
      return;
    }

    isDownloading = true;
    disableButton();

    try {
      const data = await downloadAllHistory();
      if (data.length > 0) {
        downloadCSV(data);
        downloadButton.textContent = '✅ Téléchargement terminé !';
        downloadButton.style.backgroundImage = buttonColor;
      }
    } catch (e) {
      console.error('❌ Erreur téléchargement:', e);
      downloadButton.textContent = '❌ Erreur';
      downloadButton.style.backgroundImage = 'linear-gradient(#ff0000)';
    } finally {
      setTimeout(() => {
        downloadButton.textContent = 'Télécharger tout mon historique';
        enableButton();
        isDownloading = false;
      }, 2000);
    }
  }

  function enableButton() {
    if (downloadButton) {
      downloadButton.style.backgroundImage = buttonColor;
      downloadButton.style.cursor = 'pointer';
      downloadButton.disabled = false;
    }
  }

  function disableButton() {
    if (downloadButton) {
      downloadButton.disabled = true;
      downloadButton.style.cursor = 'not-allowed';
      downloadButton.style.backgroundImage = 'linear-gradient(#aaa)';
    }
  }

  async function downloadAllHistory() {
    const allData = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    let requestCount = 0;

    console.log('🚀 Début téléchargement historique');

    while (requestCount < MAX_DOWNLOADS) {
      const dateStr = currentDate.toISOString().split('T')[0];

      const prettyDate = [
        currentDate.getDate().toString().padStart(2, '0'),
        (currentDate.getMonth() + 1).toString().padStart(2, '0'),
        currentDate.getFullYear(),
      ].join('/');

      downloadButton.textContent = `Téléchargement ${prettyDate}...`;

      try {
        const urlObj = new URL(capturedUrl, window.location.origin);
        urlObj.searchParams.set('dateDebut', dateStr);

        const response = await fetchData(urlObj.toString());
        const root = isProd ? response?.prod : response?.cons;
        const data = root?.aggregats?.heure?.donnees || [];

        console.log(`📅 ${dateStr}: ${data.length} enregistrements`);

        if (data.length === 0) {
          console.log('⚠️ Aucune donnée - Arrêt');
          break;
        }

        allData.push(...data);
        currentDate.setDate(currentDate.getDate() - 7);
        requestCount++;
      } catch (e) {
        console.log(`❌ Erreur pour ${dateStr}:`, e.message);
        break;
      }
    }

    console.log(`🎉 Total: ${allData.length} enregistrements`);
    return allData;
  }

  function fetchData(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.withCredentials = true;

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            reject(new Error('Erreur parsing JSON'));
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Erreur réseau'));
      xhr.ontimeout = () => reject(new Error('Timeout'));

      xhr.send();
    });
  }

  function downloadCSV(data) {
    data.sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));

    let csv = 'debut;fin;kW\n';
    data.forEach((row) => {
      csv += `${row.dateDebut};${row.dateFin};"${row.valeur.toString().replace('.', ',')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const prmMatch = capturedUrl.match(/prms\/(\d+)/);
    link.download = `historique_${isProd ? 'prod' : 'conso'}_${prmMatch[1]}_${new Date().toISOString().split('T')[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('📥 CSV téléchargé');
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = function (...args) {
    const [url] = args;
    const urlStr = typeof url === 'string' ? url : url.url;

    const matches = PATTERN.exec(urlStr);
    if (matches) {
      capturedUrl = urlStr;
      isProd = matches[1] === 'PROD';

      console.log(`✅ URL capturée - mode ${isProd ? 'production' : 'consommation'}`);
      enableButton();
    }

    return originalFetch.apply(this, args);
  };

  console.log('✅ Conso Downloader prêt à démarrer');

  createDownloadButton();
})();
