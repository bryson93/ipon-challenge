let appState = {
    totalSavings: 0,
    goalAmount: 0,
    currentLevel: 1,
    currentXP: 0,
    maxXP: 100,
    daysActive: 0,
    currentStreak: 0,
    lastSaveDate: null,
    totalSavedAmount: 0,
    saveCount: 0,
    achievements: [],
    transactions: []
};

const levelNames = [
    { name: "Iron 1", icon: "⚜️", xp: 100 },
    { name: "Iron 2", icon: "⚜️", xp: 200 },
    { name: "Iron 3", icon: "⚜️", xp: 300 },
    
    { name: "Bronze 1", icon: "🥉", xp: 450 },
    { name: "Bronze 2", icon: "🥉", xp: 600 },
    { name: "Bronze 3", icon: "🥉", xp: 750 },
    
    { name: "Silver 1", icon: "🥈", xp: 950 },
    { name: "Silver 2", icon: "🥈", xp: 1150 },
    { name: "Silver 3", icon: "🥈", xp: 1350 },
    
    { name: "Gold 1", icon: "🥇", xp: 1600 },
    { name: "Gold 2", icon: "🥇", xp: 1850 },
    { name: "Gold 3", icon: "🥇", xp: 2100 },
    
    { name: "Platinum 1", icon: "💎", xp: 2400 },
    { name: "Platinum 2", icon: "💎", xp: 2700 },
    { name: "Platinum 3", icon: "💎", xp: 3000 },
    
    { name: "Diamond 1", icon: "💍", xp: 3400 },
    { name: "Diamond 2", icon: "💍", xp: 3800 },
    { name: "Diamond 3", icon: "💍", xp: 4200 },
    
    { name: "Master 1", icon: "👑", xp: 4700 },
    { name: "Master 2", icon: "👑", xp: 5200 },
    { name: "Master 3", icon: "👑", xp: 5700 },
    
    { name: "Grandmaster 1", icon: "🏆", xp: 6300 },
    { name: "Grandmaster 2", icon: "🏆", xp: 6900 },
    { name: "Grandmaster 3", icon: "🏆", xp: 7500 },
    
    { name: "God 1", icon: "⚡", xp: 8500 },
    { name: "God 2", icon: "⚡", xp: 9500 },
    { name: "God 3", icon: "⚡", xp: 10500 }
];

const achievementDefinitions = [
    {
        id: "first_save",
        name: "First Save",
        icon: "🌟",
        description: "Make your first savings deposit",
        condition: () => appState.saveCount >= 1,
        progress: () => appState.saveCount >= 1 ? 1 : 0,
        target: 1
    },
    {
        id: "hot_streak",
        name: "Hot Streak",
        icon: "🔥",
        description: "Save for 3 consecutive days",
        condition: () => appState.currentStreak >= 3,
        progress: () => Math.min(appState.currentStreak, 3),
        target: 3
    },
    {
        id: "diamond_hands",
        name: "Diamond Hands",
        icon: "💎",
        description: "Save ₱5,000 in total",
        condition: () => appState.totalSavedAmount >= 5000,
        progress: () => Math.min(appState.totalSavedAmount, 5000),
        target: 5000
    },
    {
        id: "level_up",
        name: "Level Up",
        icon: "⭐",
        description: "Reach Level 5",
        condition: () => appState.currentLevel >= 5,
        progress: () => Math.min(appState.currentLevel, 5),
        target: 5
    },
    {
        id: "rocket_saver",
        name: "Rocket Saver",
        icon: "🚀",
        description: "Save ₱1,000 in a single transaction",
        condition: () => {
            const achievement = appState.achievements.find(a => a.id === "rocket_saver");
            return achievement && achievement.progress >= 1000;
        },
        progress: () => {
            const achievement = appState.achievements.find(a => a.id === "rocket_saver");
            return achievement ? achievement.progress : 0;
        },
        target: 1000,
        checkLargeSave: (amount) => amount >= 1000
    },
    {
        id: "savings_king",
        name: "Savings King",
        icon: "👑",
        description: "Reach Level 10",
        condition: () => appState.currentLevel >= 10,
        progress: () => Math.min(appState.currentLevel, 10),
        target: 10
    },
    {
        id: "disciplined",
        name: "Disciplined",
        icon: "🎖️",
        description: "Save for 7 days total",
        condition: () => appState.daysActive >= 7,
        progress: () => Math.min(appState.daysActive, 7),
        target: 7
    },
    {
        id: "strong_saver",
        name: "Strong Saver",
        icon: "💪",
        description: "Save ₱10,000 in total",
        condition: () => appState.totalSavedAmount >= 10000,
        progress: () => Math.min(appState.totalSavedAmount, 10000),
        target: 10000
    },
    {
        id: "champion",
        name: "Champion",
        icon: "🏆",
        description: "Complete a savings goal",
        condition: () => appState.goalAmount > 0 && appState.totalSavings >= appState.goalAmount,
        progress: () => appState.goalAmount > 0 ? Math.min(appState.totalSavings, appState.goalAmount) : 0,
        target: () => appState.goalAmount > 0 ? appState.goalAmount : 1
    },
    {
        id: "lightning",
        name: "Lightning",
        icon: "⚡",
        description: "Save 5 times in one day",
        condition: () => {
            const achievement = appState.achievements.find(a => a.id === "lightning");
            return achievement && achievement.progress >= 5;
        },
        progress: () => {
            const achievement = appState.achievements.find(a => a.id === "lightning");
            return achievement ? achievement.progress : 0;
        },
        target: 5
    }
];

function saveToLocalStorage() {
    localStorage.setItem('iponChallengeData', JSON.stringify(appState));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('iponChallengeData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            appState = {...appState, ...parsedData};
            
            if (appState.achievements && appState.achievements.length > 0) {
                appState.achievements = appState.achievements.map(savedAchievement => {
                    const definition = achievementDefinitions.find(a => a.id === savedAchievement.id);
                    return {
                        ...definition,
                        earned: savedAchievement.earned,
                        progress: savedAchievement.progress
                    };
                });
            }
            
            return true;
        } catch (e) {
            console.error("Error loading saved data:", e);
            return false;
        }
    }
    return false;
}

function initializeAchievements() {
    if (appState.achievements.length === 0) {
        appState.achievements = achievementDefinitions.map(achievement => ({
            ...achievement,
            earned: false,
            progress: typeof achievement.progress === 'function' ? achievement.progress() : 0
        }));
    }
    renderAchievements();
}

function renderAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    achievementsGrid.innerHTML = '';
    
    appState.achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${achievement.earned ? 'earned' : ''}`;
        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            ${!achievement.earned ? `<div class="achievement-progress">${achievement.progress}/${typeof achievement.target === 'function' ? achievement.target() : achievement.target}</div>` : ''}
        `;
        
        achievementElement.addEventListener('click', () => {
            showNotification(achievement.earned ? 
                `🏅 ${achievement.name}: ${achievement.description}` :
                `🔒 ${achievement.name}: ${achievement.description} (${achievement.progress}/${typeof achievement.target === 'function' ? achievement.target() : achievement.target})`);
        });
        
        achievementsGrid.appendChild(achievementElement);
    });
    
    updateAchievementsCount();
}

function updateAchievementsCount() {
    const earnedCount = appState.achievements.filter(a => a.earned).length;
    document.getElementById('achievementsCount').textContent = `${earnedCount}/${appState.achievements.length} Unlocked`;
}

function checkAchievements() {
    let newAchievements = [];
    
    appState.achievements.forEach(achievement => {
        if (!achievement.earned) {
            achievement.progress = achievement.progress();
            
            if (achievement.condition()) {
                achievement.earned = true;
                newAchievements.push(achievement);
            }
        }
    });
    
    if (newAchievements.length > 0) {
        renderAchievements();
        newAchievements.forEach(achievement => {
            const achievementElement = [...document.querySelectorAll('.achievement')].find(el => 
                el.querySelector('.achievement-name').textContent === achievement.name);
            if (achievementElement) {
                achievementElement.classList.add('achievement-unlocked');
                setTimeout(() => {
                    achievementElement.classList.remove('achievement-unlocked');
                }, 1000);
            }
            showNotification(`🎉 Achievement Unlocked: ${achievement.name}! ${achievement.icon}`);
        });
        saveToLocalStorage();
    }
}

function checkStreak() {
    const today = new Date().toDateString();
    
    if (appState.lastSaveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (appState.lastSaveDate === yesterday.toDateString()) {
            appState.currentStreak++;
        } else if (appState.lastSaveDate !== today) {
            appState.currentStreak = 1;
        }
        
        appState.lastSaveDate = today;
        appState.daysActive++;
        
        document.getElementById('daysValue').textContent = appState.daysActive;
        document.getElementById('streakValue').textContent = appState.currentStreak;
    }
}

function getLevelInfo(level) {
    if (level <= 0 || level > levelNames.length) {
        return { name: "Max Level", icon: "🌟", xp: 0 };
    }
    return levelNames[level - 1];
}

function updateProgress() {
    if (appState.goalAmount === 0) {
        document.getElementById('progressBar').style.width = '0%';
        document.querySelector('.progress-percentage').textContent = '0%';
        document.querySelector('.goal-info').innerHTML = `
            <span>₱${appState.totalSavings.toLocaleString()} saved</span>
            <span>Set your goal!</span>
        `;
        document.querySelector('.dashboard-card:nth-child(4) .dashboard-value').textContent = 'Set Goal';
        return;
    }
    
    const percentage = Math.min((appState.totalSavings / appState.goalAmount) * 100, 100);
    document.getElementById('progressBar').style.width = percentage + '%';
    document.getElementById('mainBalance').textContent = '₱' + appState.totalSavings.toLocaleString();
    
    document.querySelector('.progress-percentage').textContent = Math.round(percentage) + '%';
    document.querySelector('.goal-info').innerHTML = `
        <span>₱${appState.totalSavings.toLocaleString()} saved</span>
        <span>₱${appState.goalAmount.toLocaleString()} goal</span>
    `;
    
    const amountLeft = appState.goalAmount - appState.totalSavings;
    document.querySelector('.dashboard-card:nth-child(4) .dashboard-value').textContent = 
        amountLeft > 0 ? '₱' + amountLeft.toLocaleString() : '✅';
}

function addSavings() {
    const amountInput = document.getElementById('amountInput');
    const amount = parseInt(amountInput.value);
    
    if (amount && amount > 0) {
        appState.totalSavings += amount;
        appState.totalSavedAmount += amount;
        appState.currentXP += Math.floor(amount / 10);
        appState.saveCount++;
        
        appState.transactions.push({
            amount: amount,
            date: new Date().toISOString(),
            type: 'deposit'
        });
        
        amountInput.value = '';
        checkStreak();
        updateProgress();
        updateXP();
        
        if (amount >= 1000) {
            const rocketSaver = appState.achievements.find(a => a.id === "rocket_saver");
            if (rocketSaver && !rocketSaver.earned) {
                rocketSaver.progress = Math.max(rocketSaver.progress, amount);
            }
        }
        
        const lightning = appState.achievements.find(a => a.id === "lightning");
        if (lightning && !lightning.earned) {
            const today = new Date().toDateString();
            const lastSaveDate = appState.lastSaveDate;
            
            if (lastSaveDate === today) {
                lightning.progress = (lightning.progress || 0) + 1;
            } else {
                lightning.progress = 1;
            }
        }
        
        document.getElementById('mainBalance').classList.add('sparkle');
        setTimeout(() => {
            document.getElementById('mainBalance').classList.remove('sparkle');
        }, 1000);
        
        showNotification(`💰 +₱${amount.toLocaleString()} saved! Keep it up! 🎉`);
        
        while (appState.currentXP >= appState.maxXP && appState.currentLevel < levelNames.length) {
            levelUp();
        }
        
        checkAchievements();
        
        saveToLocalStorage();
    } else {
        showNotification('⚠️ Please enter a valid amount!');
    }
}

function quickAdd(amount) {
    appState.totalSavings += amount;
    appState.totalSavedAmount += amount;
    appState.currentXP += Math.floor(amount / 10);
    appState.saveCount++;
    
    appState.transactions.push({
        amount: amount,
        date: new Date().toISOString(),
        type: 'quick_deposit'
    });
    
    checkStreak();
    updateProgress();
    updateXP();
    
    if (amount >= 1000) {
        const rocketSaver = appState.achievements.find(a => a.id === "rocket_saver");
        if (rocketSaver && !rocketSaver.earned) {
            rocketSaver.progress = Math.max(rocketSaver.progress, amount);
        }
    }
    
    const lightning = appState.achievements.find(a => a.id === "lightning");
    if (lightning && !lightning.earned) {
        const today = new Date().toDateString();
        const lastSaveDate = appState.lastSaveDate;
        
        if (lastSaveDate === today) {
            lightning.progress = (lightning.progress || 0) + 1;
        } else {
            lightning.progress = 1;
        }
    }
    
    document.getElementById('mainBalance').classList.add('bounce');
    setTimeout(() => {
        document.getElementById('mainBalance').classList.remove('bounce');
    }, 600);
    
    showNotification(`⚡ Quick save +₱${amount}! Amazing! ⭐`);
    
    while (appState.currentXP >= appState.maxXP && appState.currentLevel < levelNames.length) {
        levelUp();
    }
    
    checkAchievements();
    
    saveToLocalStorage();
}

function updateXP() {
    const levelInfo = getLevelInfo(appState.currentLevel);
    const xpPercentage = (appState.currentXP / appState.maxXP) * 100;
    document.querySelector('.xp-fill').style.width = Math.min(xpPercentage, 100) + '%';
    document.querySelector('.xp-text').textContent = `${appState.currentXP.toLocaleString()} / ${appState.maxXP.toLocaleString()} XP`;
    
    document.querySelector('.level-badge').textContent = levelInfo.icon;
    document.querySelector('.level-text').innerHTML = `${levelInfo.name}<br><small>Level ${appState.currentLevel}</small>`;
}

function levelUp() {
    if (appState.currentLevel < levelNames.length) {
        appState.currentLevel++;
        const newLevelInfo = getLevelInfo(appState.currentLevel);
        appState.currentXP = appState.currentXP - appState.maxXP;
        appState.maxXP = newLevelInfo.xp;
        
        updateXP();
        showNotification(`🎊 LEVEL UP! You're now ${newLevelInfo.name}! ${newLevelInfo.icon}`);
        
        checkAchievements();
        
        saveToLocalStorage();
    } else {
        showNotification('🌟 You have reached the maximum level! Amazing!');
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showGoalModal() {
    document.getElementById('goalModal').style.display = 'flex';
}

function hideGoalModal() {
    document.getElementById('goalModal').style.display = 'none';
}

function setGoal() {
    const goalInput = document.getElementById('goalInput');
    const newGoal = parseInt(goalInput.value);
    
    if (newGoal && !isNaN(newGoal) && newGoal > 0) {
        appState.goalAmount = newGoal;
        goalInput.value = '';
        hideGoalModal();
        updateProgress();
        showNotification(`🎯 New goal set: ₱${appState.goalAmount.toLocaleString()}! Let's do this! 💪`);
        
        checkAchievements();
        
        saveToLocalStorage();
    } else {
        showNotification('⚠️ Please enter a valid goal amount!');
    }
}

function showResetModal() {
    document.getElementById('resetModal').style.display = 'flex';
}

function hideResetModal() {
    document.getElementById('resetModal').style.display = 'none';
}

function resetProgress() {
    appState = {
        totalSavings: 0,
        goalAmount: 0,
        currentLevel: 1,
        currentXP: 0,
        maxXP: 100,
        daysActive: 0,
        currentStreak: 0,
        lastSaveDate: null,
        totalSavedAmount: 0,
        saveCount: 0,
        achievements: [],
        transactions: []
    };
    
    localStorage.removeItem('iponChallengeData');
    
    initializeAchievements();
    
    updateProgress();
    updateXP();
    
    document.getElementById('daysValue').textContent = appState.daysActive;
    document.getElementById('streakValue').textContent = appState.currentStreak;
    
    hideResetModal();
    
    showNotification('🔄 All progress has been reset! Starting fresh! 🌟');
}

function showAnalytics() {
    const avgDaily = appState.daysActive > 0 ? Math.round(appState.totalSavedAmount / appState.daysActive) : 0;
    showNotification(`📊 Analytics: You saved ₱${avgDaily.toLocaleString()} per day on average! 📈`);
}

function shareProgress() {
    showNotification('📱 Progress shared! Your friends are impressed! 👏');
}

function viewHistory() {
    const transactionCount = appState.transactions.length;
    showNotification(`📚 You have ${transactionCount} transactions in your history! 📋`);
}

function budgetPlanner() {
    showNotification('📝 Budget planner opened! Plan your next moves! 💡');
}

function challenges() {
    showNotification('🏆 New challenge: Save ₱500 in 3 days! ⏱️');
}

function initApp() {
    const loaded = loadFromLocalStorage();
    
    initializeAchievements();
    updateProgress();
    updateXP();
    
    document.getElementById('daysValue').textContent = appState.daysActive;
    document.getElementById('streakValue').textContent = appState.currentStreak;
    
    if (loaded) {
        showNotification('📊 Your saved progress has been loaded! Welcome back! 🎉');
    }
}

window.onload = initApp;