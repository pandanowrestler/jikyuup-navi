// === 1. DOM要素の取得 ===
// HTMLファイルで定義した各要素をJavaScriptで操作できるように取得します。
const annualIncomeInput = document.getElementById('annualIncome');
const workHoursInput = document.getElementById('workHours');
const calculateButton = document.getElementById('calculateButton');
const hourlyWageResult = document.getElementById('hourlyWageResult');
const itemSuggestionsDiv = document.getElementById('itemSuggestions');

// === 2. 時短アイテムのデータ定義 ===
// 各時短アイテムの情報（削減時間、目安価格、提案メッセージなど）をオブジェクトの配列として定義します。
// ここに新しいアイテムを追加することで、サイトのコンテンツを簡単に拡張できます。
const timeSavingItems = [
    {
        name: '食洗機',
        dailyMinutesSaved: 15, // 1日あたり削減される時間（分）
        priceEstimate: 80000,  // おおよその製品価格（円）
        message: 'この時間でプログラミング学習を進め、将来の時給をUP！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E9%A3%9F%E6%B4%97%E6%A9%9F' // Amazon検索リンク例
    },
    {
        name: 'ロボット掃除機',
        weeklyHoursSaved: 2,   // 週あたり削減される時間（時間）
        priceEstimate: 50000,
        message: 'この時間で読書や資格勉強に集中し、キャリアアップを加速！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E3%83%AD%E3%83%9C%E3%83%83%E3%83%88%E6%8E%83%E9%99%A4%E6%A9%9F'
    },
    {
        name: '乾燥機付き洗濯機',
        weeklyHoursSaved: 3,
        priceEstimate: 150000,
        message: 'この時間で副業に挑戦し、収入源を増やそう！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E4%B9%BE%E7%87%A5%E6%A9%9F%E4%BB%98%E3%81%8D%E6%B4%97%E6%BF%AF%E6%A9%9F'
    },
    {
        name: '食材宅配サービス',
        weeklyHoursSaved: 1.5,
        priceEstimate: 100000, // 年間サービス利用料目安
        message: 'この時間で休息を取り、心身の健康に投資！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E9%A3%9F%E6%9D%90%E5%AE%85%E9%85%8D%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9'
    },
    {
        name: 'スマートロック',
        dailyMinutesSaved: 5,
        priceEstimate: 30000,
        message: '鍵を探す時間ゼロ！その数分で集中力を高めよう！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%83%AD%E3%83%83%E3%82%AF'
    }
];

// === 3. イベントリスナーの設定 ===
// 「計算する」ボタンがクリックされたときに、calculateHourlyWage関数を実行するように設定します。
calculateButton.addEventListener('click', calculateHourlyWage);

// === 4. 時給計算関数 ===
function calculateHourlyWage() {
    const annualIncome = parseFloat(annualIncomeInput.value); // 年収の入力値を取得し数値に変換
    const workHours = parseFloat(workHoursInput.value);     // 労働時間の入力値を取得し数値に変換

    // 入力値のバリデーション（簡易版）
    if (isNaN(annualIncome) || annualIncome <= 0 || isNaN(workHours) || workHours <= 0) {
        hourlyWageResult.textContent = '入力が不正です';
        itemSuggestionsDiv.innerHTML = '<p style="text-align:center; color:#e74c3c;">年収と労働時間を正しく入力してください。</p>';
        return; // 処理を中断
    }

    const hourlyWage = Math.round(annualIncome / workHours); // 時給を計算（四捨五入）
    hourlyWageResult.textContent = `${hourlyWage.toLocaleString()}円`; // 結果をページに表示（カンマ区切り）

    // 時短アイテムの提案を更新
    updateTimeSavingSuggestions(hourlyWage);
}

// === 5. 時短アイテム提案の更新関数 ===
function updateTimeSavingSuggestions(hourlyWage) {
    itemSuggestionsDiv.innerHTML = ''; // 既存の提案をクリア

    timeSavingItems.forEach(item => {
        let annualMinutesSaved = 0;
        if (item.dailyMinutesSaved) {
            annualMinutesSaved = item.dailyMinutesSaved * 365; // 日単位を年単位に変換
        } else if (item.weeklyHoursSaved) {
            annualMinutesSaved = item.weeklyHoursSaved * 60 * 52; // 週単位を年単位に変換
        }

        const annualHoursSaved = annualMinutesSaved / 60; // 分を時間に戻す
        const annualValue = Math.round(annualHoursSaved * hourlyWage); // 年間削減価値

        // 投資回収目安を計算（月単位）
        let paybackPeriodMonths = null;
        if (item.priceEstimate > 0 && annualValue > 0) {
            paybackPeriodMonths = Math.round((item.priceEstimate / annualValue) * 12);
        }

        // 各アイテムのHTML要素を作成
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('time-saving-item'); // CSSクラスを追加

        itemDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>想定削減時間: 年間 <strong>${Math.round(annualHoursSaved).toLocaleString()}時間</strong></p>
            <p>あなたの時給換算価値: 年間 <strong>${annualValue.toLocaleString()}円</strong> 相当</p>
            <p>製品価格目安: 約 <strong>${item.priceEstimate.toLocaleString()}円</strong></p>
            ${paybackPeriodMonths !== null ? `<p>投資回収目安: 約 <strong>${paybackPeriodMonths}ヶ月</strong></p>` : ''}
            <p class="suggestion-message">${item.message}</p>
            <a href="${item.affiliateLink}" target="_blank" class="buy-button">Amazonで探す</a>
        `;
        itemSuggestionsDiv.appendChild(itemDiv); // ページに追加
    });
}