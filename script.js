// === 1. DOM要素の取得 ===
const monthlySalaryInput = document.getElementById('monthlySalary'); // 月給入力欄
const bonusInputsContainer = document.getElementById('bonusInputsContainer'); // ボーナス入力欄コンテナ
const addBonusButton = document.getElementById('addBonusButton'); // ボーナス追加ボタン

const workHoursInput = document.getElementById('workHours');
const lifestyleSelect = document.getElementById('lifestyle'); // ライフスタイル選択欄

// 家事時間入力タブ関連
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

// 各カテゴリのスライダーと表示要素
const choresElements = {
    all: {
        slider: document.getElementById('choresTimeSliderAll'),
        display: document.getElementById('choresTimeDisplayAll'),
        mark: document.getElementById('choresMarkAll'),
        note: document.getElementById('choresNoteAll')
    },
    cooking: {
        slider: document.getElementById('choresTimeSliderCooking'),
        display: document.getElementById('choresTimeDisplayCooking'),
        mark: document.getElementById('choresMarkCooking'),
        note: document.getElementById('choresNoteCooking')
    },
    laundry: {
        slider: document.getElementById('choresTimeSliderLaundry'),
        display: document.getElementById('choresTimeDisplayLaundry'),
        mark: document.getElementById('choresMarkLaundry'),
        note: document.getElementById('choresNoteLaundry')
    },
    cleaning: {
        slider: document.getElementById('choresTimeSliderCleaning'),
        display: document.getElementById('choresTimeDisplayCleaning'),
        mark: document.getElementById('choresMarkCleaning'),
        note: document.getElementById('choresNoteCleaning')
    },
    misc: {
        slider: document.getElementById('choresTimeSliderMisc'),
        display: document.getElementById('choresTimeDisplayMisc'),
        mark: document.getElementById('choresMarkMisc'),
        note: document.getElementById('choresNoteMisc')
    }
};

const calculateButton = document.getElementById('calculateButton');
const hourlyWageResult = document.getElementById('hourlyWageResult');

// 新しいレイアウト用のDOM要素
const timeSavingItemsContainer = document.getElementById('timeSavingItemsContainer');

// Chart.jsのインスタンスを保持するオブジェクト (アイテムごとに異なるグラフを保持するため)
const charts = {};

// === 2. データ定義 ===

// 2.1 時短アイテムのデータ定義
// 週あたりの頻度、1回あたりの準備時間、機械稼働時間を追加
const timeSavingItems = [
    {
        id: 'dishwasher',
        name: '食洗機',
        category: 'cooking',
        handworkReductionRate: 0.80, // 手作業削減率
        preparationTimePerUse: 0.08, // 食器を食洗機に入れる時間 (5分/回 = 0.083時間)
        machineTimePerUse: 1.5, // 食洗機稼働時間 (1.5時間/回)
        frequencyPerWeek: 7, // 週7回使用と想定
        priceEstimate: 80000,
        message: '手洗いの時間から解放され、プログラミング学習や読書へ！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E9%A3%9F%E6%B4%97%E6%A9%9F'
    },
    {
        id: 'foodDelivery',
        name: '食材宅配サービス',
        category: 'cooking',
        handworkReductionRate: 0.20, // 献立検討・買い物時間の20%削減を想定
        preparationTimePerUse: 0.1, // 注文・受け取り時間 (6分/回)
        machineTimePerUse: 0, // 機械稼働なし
        frequencyPerWeek: 1, // 週1回利用と想定
        priceEstimate: 100000, // 年間サービス利用料目安
        message: '献立の悩みや買い物の時間を省き、心身のリフレッシュを！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E9%A3%9F%E6%9D%90%E5%AE%85%E9%85%8D%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9'
    },
    {
        id: 'autoCooker',
        name: '自動調理器 (例: ホットクック)',
        category: 'cooking',
        handworkReductionRate: 0.35, // 調理時間の35%削減を想定
        preparationTimePerUse: 0.25, // 材料準備・セットアップ時間 (15分/回)
        machineTimePerUse: 1.0, // 調理時間 (1時間/回)
        frequencyPerWeek: 3, // 週3回使用と想定
        priceEstimate: 40000,
        message: '料理の手間を減らし、その時間で新しいスキルを習得！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E8%87%AA%E5%8B%95%E8%AA%BF%E7%90%86%E5%99%A8+%E3%83%9B%E3%83%83%E3%83%88%E3%82%AF%E3%83%83%E3%82%AF'
    },
    {
        id: 'dryerWasher',
        name: '乾燥機付き洗濯機',
        category: 'laundry',
        handworkReductionRate: 0.60, // 干す・取り込む・畳む時間からの60%削減を想定
        preparationTimePerUse: 0.05, // 洗濯物を入れる・出す時間 (3分/回)
        machineTimePerUse: 3.0, // 洗濯〜乾燥時間 (3時間/回)
        frequencyPerWeek: 3, // 週3回使用と想定
        priceEstimate: 150000,
        message: '洗濯物を干す・取り込む手間がゼロに。副業や家族との時間へ！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E4%B9%BE%E7%87%A5%E6%A9%9F%E4%BB%98%E3%81%8D%E6%B4%97%E6%BF%AF%E6%A9%9F'
    },
    {
        id: 'robotCleaner',
        name: 'ロボット掃除機',
        category: 'cleaning',
        handworkReductionRate: 0.70, // リビングやフローリング掃除時間の70%削減を想定
        preparationTimePerUse: 0.05, // 部屋の片付け・セットアップ時間 (3分/回)
        machineTimePerUse: 1.0, // 掃除稼働時間 (1時間/回)
        frequencyPerWeek: 3, // 週3回使用と想定
        priceEstimate: 50000,
        message: '掃除に費やしていた時間を、資格勉強や趣味に充てよう！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E3%83%AD%E3%83%9C%E3%83%83%E3%83%88%E6%8E%83%E9%99%A4%E6%A9%9F'
    },
    {
        id: 'bathCleaner',
        name: 'お風呂自動洗浄機',
        category: 'cleaning',
        handworkReductionRate: 0.80, // お風呂掃除時間の80%削減を想定
        preparationTimePerUse: 0.05, // セットアップ時間 (3分/回)
        machineTimePerUse: 0.5, // 洗浄時間 (30分/回)
        frequencyPerWeek: 1, // 週1回使用と想定
        priceEstimate: 30000, // 製品価格または設置費用
        message: '面倒なお風呂掃除から解放。浮いた時間でリラックスタイムを！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E3%81%8A%E9%A2%A8%E5%91%82%E8%87%AA%E5%8B%95%E6%B4%97%E6%B5%84%E6%A9%9F'
    },
    {
        id: 'subscription',
        name: '日用品のサブスクリプション',
        category: 'misc',
        handworkReductionRate: 0.10, // 日用品の買い出し時間の10%削減を想定
        preparationTimePerUse: 0.1, // 注文・受け取り時間 (6分/回)
        machineTimePerUse: 0, // 機械稼働なし
        frequencyPerWeek: 0.25, // 月1回（週0.25回）と想定
        priceEstimate: 5000, // 年間コスト目安
        message: '定期的な買い出しの手間を省き、時間を有効活用！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E6%97%A5%E7%94%A8%E5%93%81%E3%82%B5%E3%83%96%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3'
    },
    {
        id: 'smartHome',
        name: 'スマートホームデバイス連携（照明・エアコンなど）',
        category: 'misc',
        handworkReductionRate: 0.05, // 細かい手間（電気のつけ消し、温度調整など）の5%削減を想定
        preparationTimePerUse: 0, // 準備時間ほぼなし
        machineTimePerUse: 0, // 機械稼働も目に見える形ではなし
        frequencyPerWeek: 1, // 週に複数回利用するが、時間削減効果は微小
        priceEstimate: 30000,
        message: '声一つで家事が片付く未来。小さな時間節約が積もり積もって大きな成果に！',
        affiliateLink: 'https://www.amazon.co.jp/s?k=%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%83%9B%E3%83%BC%E3%83%A0%E3%83%87%E3%83%90%E3%82%A4%E3%83%93%E3%82%B9'
    },
    {
        id: 'housekeeping',
        name: '家事代行サービス（スポット利用）',
        category: 'all', // このカテゴリはグラフには直接表示せず、全体の家事時間で提案
        handworkReductionRate: 0.20, // 依頼内容によるが、全体の20%削減と仮定
        preparationTimePerUse: 0.5, // 打ち合わせ・指示時間 (30分/回)
        machineTimePerUse: 8.0, // 代行サービス稼働時間 (8時間/回)
        frequencyPerWeek: 0.25, // 月1回（週0.25回）と想定
        priceEstimate: 200000, // 年間コスト目安（月1回8時間で仮定）
        message: 'プロに家事を任せて、大幅な時間と心のゆとりを手に入れよう！',
        affiliateLink: 'https://www.taskaji.jp/'
    }
];


// 2.2 ライフスタイル別・一般的な家事時間（週あたりの時間）
const typicalWeeklyChoresHours = {
    all: { single: 7, couple: 14, family_young: 21, family_old: 17.5, other: 10 },
    cooking: { single: 3, couple: 6, family_young: 9, family_old: 7, other: 5 },
    laundry: { single: 1.5, couple: 3, family_young: 6, family_old: 4.5, other: 2.5 },
    cleaning: { single: 1.5, couple: 3, family_young: 4, family_old: 3.5, other: 2.5 },
    misc: { single: 1, couple: 2, family_young: 2, family_old: 2, other: 1 }
};

// === 2.3 ボーナス入力欄の動的追加機能 ===
let bonusCount = 0;
const MAX_BONUS_FIELDS = 3;

addBonusButton.addEventListener('click', addBonusInputField);

function addBonusInputField() {
    if (bonusCount >= MAX_BONUS_FIELDS) {
        alert(`ボーナスは最大${MAX_BONUS_FIELDS}回まで入力できます。`);
        return;
    }
    bonusCount++;
    const bonusDiv = document.createElement('div');
    bonusDiv.classList.add('input-group', 'bonus-input-group');
    bonusDiv.innerHTML = `
        <label for="bonus${bonusCount}">ボーナス ${bonusCount}回目（額面、円）:</label>
        <input type="number" id="bonus${bonusCount}" placeholder="例: 500000" min="0">
        <button type="button" class="remove-bonus-button" data-bonus-id="${bonusCount}">×</button>
    `;
    bonusInputsContainer.appendChild(bonusDiv);
    const removeButton = bonusDiv.querySelector('.remove-bonus-button');
    removeButton.addEventListener('click', (event) => {
        removeBonusInputField(event.target);
    });
}

function removeBonusInputField(buttonElement) {
    const bonusDivToRemove = buttonElement.closest('.bonus-input-group');
    if (bonusDivToRemove) {
        bonusInputsContainer.removeChild(bonusDivToRemove);
        bonusCount--;
        updateBonusFieldLabels();
        calculateHourlyWage();
    }
}

function updateBonusFieldLabels() {
    const bonusInputGroups = bonusInputsContainer.querySelectorAll('.bonus-input-group');
    bonusInputGroups.forEach((group, index) => {
        const label = group.querySelector('label');
        const input = group.querySelector('input');
        const button = group.querySelector('.remove-bonus-button');
        const newIndex = index + 1;
        label.setAttribute('for', `bonus${newIndex}`);
        label.textContent = `ボーナス ${newIndex}回目（額面、円）:`;
        input.id = `bonus${newIndex}`;
        button.dataset.bonusId = newIndex;
    });
}

// 初期状態でボーナス入力欄を1つ表示
addBonusInputField();

// === 2.4 家事時間スライダーの連動機能 ===

/**
 * ライフスタイル選択に応じて、現在のタブのスライダー初期値と目安点を更新します。
 * @param {string} categoryId - 更新するカテゴリのID (例: 'all', 'cooking')
 */
function updateChoresTimeSlider(categoryId) {
    const selectedLifestyle = lifestyleSelect.value;
    const initialHours = typicalWeeklyChoresHours[categoryId][selectedLifestyle] || typicalWeeklyChoresHours[categoryId]['other'];
    
    const slider = choresElements[categoryId].slider;
    const display = choresElements[categoryId].display;
    const mark = choresElements[categoryId].mark;
    const note = choresElements[categoryId].note;

    if (slider) { // スライダーが存在する場合のみ実行
        slider.value = initialHours; // スライダーの値を更新
        updateChoresMarkPosition(slider, mark, initialHours); // 目安点の位置を更新
        updateChoresTimeDisplay(slider, display, note); // 表示を更新
    }
    // calculateHourlyWage(); // 計算も再実行 - スライダー変更時、ライフスタイル変更時は下のイベントリスナーで実行
}

/**
 * スライダーの値に基づいて表示を更新し、「一般的な目安」の表示/非表示を切り替えます。
 * @param {HTMLInputElement} slider - 対象のスライダー要素
 * @param {HTMLElement} displayElement - 時間を表示する要素
 * @param {HTMLElement} noteElement - 「一般的な目安」のspan要素
 */
function updateChoresTimeDisplay(slider, displayElement, noteElement) {
    const currentHours = parseFloat(slider.value);
    const selectedLifestyle = lifestyleSelect.value;
    const categoryId = slider.id.replace('choresTimeSlider', '').toLowerCase(); 
    
    const initialHours = typicalWeeklyChoresHours[categoryId][selectedLifestyle] || typicalWeeklyChoresHours[categoryId]['other'];

    displayElement.textContent = `${currentHours}時間`;

    if (currentHours === initialHours) {
        noteElement.style.display = 'inline'; // 表示
    } else {
        noteElement.style.display = 'none'; // 非表示
    }
}

// === 2.5 スライダー上の目安点表示機能 ===
/**
 * スライダーのトラック上に対象時間の目安点を表示します。
 * @param {HTMLInputElement} slider - 対象のスライダー要素
 * @param {HTMLElement} markElement - 目安点表示用の要素
 * @param {number} targetHours - 表示したい目安点の時間
 */
function updateChoresMarkPosition(slider, markElement, targetHours) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const value = parseFloat(targetHours);

    const percentage = ((value - min) / (max - min)) * 100;
    const thumbWidth = 20; // スライダーのつまみの幅

    let leftPosition;
    if (percentage === 0) {
        leftPosition = `0px`;
    } else if (percentage === 100) {
        leftPosition = `calc(100% - ${thumbWidth}px)`;
    } else {
        leftPosition = `calc(${percentage}% - ${thumbWidth / 2}px)`;
    }
    
    markElement.style.left = leftPosition;
    markElement.style.display = 'block';
}


// === 3. イベントリスナーの設定 ===

// タブボタンのクリックイベント
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;

        // すべてのタブボタンとタブコンテンツからactiveクラスを削除
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // クリックされたタブボタンと対応するタブコンテンツにactiveクラスを追加
        button.classList.add('active');
        document.getElementById(`tab-${targetTab}`).classList.add('active');

        // タブ切り替え時に、そのタブのスライダーも更新（目安点を再描画）
        if (choresElements[targetTab] && choresElements[targetTab].slider) {
            updateChoresMarkPosition(
                choresElements[targetTab].slider,
                choresElements[targetTab].mark,
                parseFloat(choresElements[targetTab].slider.value)
            );
        }
    });
});


calculateButton.addEventListener('click', calculateHourlyWage);

// ライフスタイル選択が変わったら、全てのスライダーと提案を更新
lifestyleSelect.addEventListener('change', () => {
    for (const categoryId in choresElements) {
        updateChoresTimeSlider(categoryId);
    }
    calculateHourlyWage(); // 再計算して提案も更新
});

// 各スライダーのinputイベントを設定（リアルタイム更新）
for (const categoryId in choresElements) {
    const slider = choresElements[categoryId].slider;
    if (slider) {
        const display = choresElements[categoryId].display;
        const mark = choresElements[categoryId].mark;
        const note = choresElements[categoryId].note;
        slider.addEventListener('input', () => {
            updateChoresTimeDisplay(slider, display, note);
            updateChoresMarkPosition(slider, mark, parseFloat(slider.value)); // スライダー動かした時も目安点更新
            calculateHourlyWage(); // スライダー変更時も再計算
        });
    }
}

// 月給や労働時間、ボーナス入力欄の値が変更されたらリアルタイムで計算する
monthlySalaryInput.addEventListener('input', calculateHourlyWage);
workHoursInput.addEventListener('input', calculateHourlyWage);
bonusInputsContainer.addEventListener('input', (event) => {
    if (event.target.id.startsWith('bonus')) {
        calculateHourlyWage();
    }
});


// === 4. 時給計算関数 ===
function calculateHourlyWage() {
    const monthlySalary = parseFloat(monthlySalaryInput.value) || 0;
    const workHours = parseFloat(workHoursInput.value);

    let totalBonus = 0;
    const bonusInputs = bonusInputsContainer.querySelectorAll('input[id^="bonus"]');
    bonusInputs.forEach(input => {
        totalBonus += parseFloat(input.value) || 0;
    });

    const annualIncome = (monthlySalary * 12) + totalBonus;

    if (annualIncome <= 0 || isNaN(workHours) || workHours <= 0) {
        hourlyWageResult.textContent = '---円';
        timeSavingItemsContainer.innerHTML = '<p style="text-align:center; color:#e74c3c;">月給と労働時間を正しく入力してください。（ボーナスは任意）</p>';
        return;
    }

    const hourlyWage = Math.round(annualIncome / workHours);
    hourlyWageResult.textContent = `${hourlyWage.toLocaleString()}円`;

    // 時短アイテムの提案を更新
    updateTimeSavingSuggestions(hourlyWage);
}

// === 5. 時短アイテム提案の更新関数 ===
/**
 * 時給に基づいて時短アイテムの提案を更新し、グラフも描画します。
 * @param {number} hourlyWage - 計算された時給
 */
function updateTimeSavingSuggestions(hourlyWage) {
    timeSavingItemsContainer.innerHTML = ''; // 一度既存の内容をクリア

    if (hourlyWage <= 0) {
        timeSavingItemsContainer.innerHTML = '<p style="text-align:center; color:#e74c3c;">時給を計算すると提案が表示されます。</p>';
        return;
    }

    timeSavingItems.forEach((item, index) => {
        // 'all'カテゴリのアイテムはグラフ表示対象外とする
        if (item.category === 'all') {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('time-saving-item-block');
            itemDiv.innerHTML = `
                <div class="item-info-panel" style="flex: 1 1 100%;">
                    <h4>${item.name}</h4>
                    <p class="suggestion-message">${item.message}</p>
                    <a href="${item.affiliateLink}" target="_blank" class="buy-button">Amazonで探す</a>
                </div>
            `;
            timeSavingItemsContainer.appendChild(itemDiv);
            return; // 次のアイテムへ
        }

        const currentChoresHours = parseFloat(choresElements[item.category].slider.value) || 
                                 typicalWeeklyChoresHours[item.category][lifestyleSelect.value] || 
                                 typicalWeeklyChoresHours[item.category]['other'];
        
        // 時短導入後の自分が関わる時間（残りの手作業 + 準備時間）
        // スライダーで設定された現在の家事時間を基準に、削減率を適用
        let selfChoresTimeAfter = (currentChoresHours * (1 - item.handworkReductionRate));
        // 週の準備時間を加算
        selfChoresTimeAfter += (item.preparationTimePerUse * item.frequencyPerWeek);

        // 機械が稼働している時間
        const machineChoresTime = item.machineTimePerUse * item.frequencyPerWeek;

        // 総時間削減効果（自分が関わる時間ベース）
        const weeklySelfTimeSaved = currentChoresHours - selfChoresTimeAfter;
        const annualSelfTimeSaved = weeklySelfTimeSaved * 52;
        const annualSelfValue = Math.round(annualSelfTimeSaved * hourlyWage);

        let paybackPeriodMonths = null;
        if (item.priceEstimate > 0 && annualSelfValue > 0) {
            paybackPeriodMonths = Math.round((item.priceEstimate / annualSelfValue) * 12);
        }

        const itemBlockDiv = document.createElement('div');
        itemBlockDiv.classList.add('time-saving-item-block');

        // 左側のアイテム情報パネル
        const itemInfoPanel = document.createElement('div');
        itemInfoPanel.classList.add('item-info-panel');
        itemInfoPanel.innerHTML = `
            <h4>${item.name}</h4>
            <p>想定削減時間: あなたが関わる時間 <strong>年間 ${Math.round(annualSelfTimeSaved).toLocaleString()}時間</strong></p>
            <p>あなたの時給換算価値: 年間 <strong>${annualSelfValue.toLocaleString()}円</strong> 相当</p>
            <p>製品価格目安: 約 <strong>${item.priceEstimate.toLocaleString()}円</strong></p>
            ${paybackPeriodMonths !== null ? `<p>投資回収目安: 約 <strong>${paybackPeriodMonths}ヶ月</strong></p>` : ''}
            <p class="suggestion-message">${item.message}</p>
            <a href="${item.affiliateLink}" target="_blank" class="buy-button">Amazonで探す</a>
        `;
        itemBlockDiv.appendChild(itemInfoPanel);

        // 右側のグラフパネル
        const itemGraphPanel = document.createElement('div');
        itemGraphPanel.classList.add('item-graph-panel');
        itemGraphPanel.innerHTML = `
            <h4>${item.name}導入による${getCategoryLabel(item.category)}の家事時間削減効果 (週あたり)</h4>
            <div class="chart-canvas-wrapper">
                <canvas id="chart-${item.id}"></canvas>
            </div>
            <p class="graph-message">※時短導入後も機械が稼働している時間は発生しますが、<br>あなたが自由になる時間が大きく増えます。</p>
        `;
        itemBlockDiv.appendChild(itemGraphPanel);
        timeSavingItemsContainer.appendChild(itemBlockDiv);

        // 各アイテムブロックが生成された後にグラフを描画
        renderChart(item.id, item.name, item.category, currentChoresHours, selfChoresTimeAfter, machineChoresTime);
    });
}

// === 6. グラフ描画関数 ===
/**
 * 指定された時短アイテムの効果を示す横棒グラフを描画します。
 * @param {string} chartId - Canvas要素のID
 * @param {string} itemName - アイテム名
 * @param {string} categoryId - 家事カテゴリID
 * @param {number} currentChoresHours - 現在の家事時間（手作業）
 * @param {number} selfChoresTimeAfter - 時短導入後の自分が関わる時間
 * @param {number} machineChoresTime - 時短導入後の機械稼働時間
 */
function renderChart(chartId, itemName, categoryId, currentChoresHours, selfChoresTimeAfter, machineChoresTime) {
    const ctx = document.getElementById(`chart-${chartId}`).getContext('2d');

    // 既存のグラフがあれば破棄
    if (charts[chartId]) {
        charts[chartId].destroy();
    }

    // Y軸の最大値を設定（現在の時間または時短後の総時間のうち大きい方に少し余裕を持たせる）
    const maxTime = Math.max(currentChoresHours, (selfChoresTimeAfter + machineChoresTime)) * 1.2;
    const recommendedMax = Math.ceil(maxTime / 5) * 5; // 5刻みに切り上げ

    charts[chartId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['現在の家事時間', '時短導入後'],
            datasets: [
                {
                    label: 'あなたが関わる時間',
                    data: [currentChoresHours, selfChoresTimeAfter],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)', // 現在の時間 (青系)
                        'rgba(40, 167, 69, 0.7)'  // 時短導入後の自分で関わる時間 (緑系)
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(40, 167, 69, 1)'
                    ],
                    borderWidth: 1
                },
                {
                    label: '機械が稼働している時間',
                    data: [0, machineChoresTime], // 現在の家事時間は0、時短導入後に機械稼働時間を表示
                    backgroundColor: 'rgba(243, 156, 18, 0.7)', // 機械時間 (オレンジ系)
                    borderColor: 'rgba(243, 156, 18, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y', // 横棒グラフにする
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom', // 凡例を下部に表示
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.x !== null) {
                                label += `${context.parsed.x.toFixed(1)}時間`;
                            }
                            return label;
                        },
                        // 総時間もツールチップに表示
                        afterBody: function(context) {
                            if (context[0].label === '時短導入後') {
                                const totalReducedTime = selfChoresTimeAfter + machineChoresTime;
                                return `総家事時間: ${totalReducedTime.toFixed(1)}時間`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true, // 積み上げ棒グラフにする
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '時間 (h)',
                        color: '#555'
                    },
                    min: 0,
                    max: recommendedMax, // 動的に調整した最大値を適用
                    ticks: {
                        stepSize: 1 // 1時間刻み
                    }
                },
                y: {
                    stacked: true, // 積み上げ棒グラフにする
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 14 // Y軸のラベルフォントサイズ
                        }
                    }
                }
            }
        }
    });
}


/**
 * カテゴリIDから表示用のラベルを取得するヘルパー関数
 * @param {string} categoryId - カテゴリのID
 * @returns {string} カテゴリの表示名
 */
function getCategoryLabel(categoryId) {
    switch (categoryId) {
        case 'cooking': return '料理・食事関連';
        case 'laundry': return '洗濯関連';
        case 'cleaning': return '掃除関連';
        case 'misc': return 'その他の家事';
        case 'all': return '全体の家事';
        default: return '';
    }
}

// === 初期化処理 ===
document.addEventListener('DOMContentLoaded', () => {
    // ライフスタイル選択に基づいて全てのスライダーの初期値を設定
    for (const categoryId in choresElements) {
        if (choresElements[categoryId].slider) {
            updateChoresTimeSlider(categoryId);
        }
    }
    // 初期計算を実行して、時給と提案を表示
    calculateHourlyWage();

    // 初回表示時に「全体の家事」タブをアクティブにする
    document.querySelector('.tab-button[data-tab="all"]').click();
});