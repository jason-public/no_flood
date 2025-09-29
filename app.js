// 애플리케이션 데이터
const appData = {
  systemInfo: {
    totalBudget: "8억 5,700만원",
    nationalFunding: "4억 4천만원",
    completionDate: "2025년 1월",
    award: "행정안전부 장관상 (2025년 9월)",
    accuracy: "96%"
  },
  monitoringPoints: [
    {
      id: 1,
      name: "영천 지하차도",
      type: "지하차도",
      status: "정상",
      waterLevel: 15,
      maxLevel: 100,
      latitude: 37.1326,
      longitude: 128.1906,
      lastUpdate: "2025-09-29 09:51:00",
      sensors: {
        waterSensor: "정상",
        cctv: "정상",
        barrier: "정상",
        display: "정상"
      }
    },
    {
      id: 2,
      name: "강저 지하차도",
      type: "지하차도",
      status: "정상",
      waterLevel: 22,
      maxLevel: 100,
      latitude: 37.1281,
      longitude: 128.1952,
      lastUpdate: "2025-09-29 09:51:00",
      sensors: {
        waterSensor: "정상",
        cctv: "정상",
        barrier: "정상",
        display: "정상"
      }
    },
    {
      id: 3,
      name: "장평 지하차도",
      type: "지하차도",
      status: "주의",
      waterLevel: 45,
      maxLevel: 100,
      latitude: 37.1402,
      longitude: 128.2134,
      lastUpdate: "2025-09-29 09:50:30",
      sensors: {
        waterSensor: "정상",
        cctv: "정상",
        barrier: "대기",
        display: "주의 표시"
      }
    },
    {
      id: 4,
      name: "공전 지하차도",
      type: "지하차도",
      status: "정상",
      waterLevel: 18,
      maxLevel: 100,
      latitude: 37.1523,
      longitude: 128.1897,
      lastUpdate: "2025-09-29 09:51:00",
      sensors: {
        waterSensor: "정상",
        cctv: "정상",
        barrier: "정상",
        display: "정상"
      }
    },
    {
      id: 5,
      name: "시곡 지하차도",
      type: "지하차도",
      status: "정상",
      waterLevel: 12,
      maxLevel: 100,
      latitude: 37.1189,
      longitude: 128.1678,
      lastUpdate: "2025-09-29 09:51:00",
      sensors: {
        waterSensor: "정상",
        cctv: "정상",
        barrier: "정상",
        display: "정상"
      }
    },
    {
      id: 6,
      name: "신동 터널",
      type: "지하터널",
      status: "정상",
      waterLevel: 8,
      maxLevel: 100,
      latitude: 37.1445,
      longitude: 128.1756,
      lastUpdate: "2025-09-29 09:51:00",
      sensors: {
        waterSensor: "정상",
        cctv: "정상",
        barrier: "정상",
        display: "정상"
      }
    },
    {
      id: 7,
      name: "조차장역 터널",
      type: "지하터널",
      status: "정상",
      waterLevel: 25,
      maxLevel: 100,
      latitude: 37.1367,
      longitude: 128.2089,
      lastUpdate: "2025-09-29 09:51:00",
      sensors: {
        waterSensor: "정상",
        cctv: "정상",
        barrier: "정상",
        display: "정상"
      }
    },
    {
      id: 8,
      name: "하소천 산책로",
      type: "수변공원",
      status: "정상",
      waterLevel: 35,
      maxLevel: 100,
      latitude: 37.1298,
      longitude: 128.1834,
      lastUpdate: "2025-09-29 09:51:00",
      sensors: {
        waterSensor: "정상",
        cctv: "정상",
        barrier: "해당없음",
        display: "정상"
      }
    }
  ],
  alertLevels: [
    {
      level: "관심",
      color: "#3B82F6",
      threshold: "0-25%",
      actions: ["실시간 모니터링"]
    },
    {
      level: "주의",
      color: "#EAB308", 
      threshold: "26-50%",
      actions: ["담당자 문자 발송", "전광판 주의 표시"]
    },
    {
      level: "경계",
      color: "#F97316",
      threshold: "51-75%",
      actions: ["차량 차단기 준비", "자동 안내 방송", "유관기관 알림"]
    },
    {
      level: "심각",
      color: "#EF4444",
      threshold: "76-100%",
      actions: ["차량 통제", "긴급 대응팀 출동", "112/119 자동 신고"]
    }
  ],
  systemComponents: [
    {name: "수위 센서", status: "정상", count: 8},
    {name: "AI CCTV", status: "정상", count: 8},
    {name: "차량 차단기", status: "정상", count: 7},
    {name: "전광판", status: "정상", count: 8},
    {name: "방송 시설", status: "정상", count: 8}
  ],
  statistics: {
    systemUptime: "99.8%",
    preventedIncidents: 24,
    falseAlarmRate: "4%",
    responseTime: "< 30초"
  }
};

// 글로벌 변수
let waterLevelChart;
let updateInterval;

// DOM 요소들
const elements = {
  currentTime: document.getElementById('currentTime'),
  mapContainer: document.getElementById('mapContainer'),
  statusFilter: document.getElementById('statusFilter'),
  alertLevels: document.getElementById('alertLevels'),
  componentsGrid: document.getElementById('componentsGrid'),
  detailModal: document.getElementById('detailModal'),
  modalClose: document.getElementById('modalClose'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  alertToast: document.getElementById('alertToast'),
  toastMessage: document.getElementById('toastMessage'),
  exportBtn: document.getElementById('exportBtn')
};

// 초기화 함수
function init() {
  updateTime();
  renderMonitoringPoints();
  renderAlertLevels();
  renderSystemComponents();
  initWaterLevelChart();
  setupEventListeners();
  startDataUpdates();
}

// 현재 시간 업데이트
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  elements.currentTime.textContent = timeString;
}

// 모니터링 지점 렌더링
function renderMonitoringPoints(filter = 'all') {
  const filteredPoints = filter === 'all' 
    ? appData.monitoringPoints 
    : appData.monitoringPoints.filter(point => point.status === filter);

  elements.mapContainer.innerHTML = filteredPoints.map(point => {
    // 상대적 위치 계산 (가상의 지도 좌표)
    const x = ((point.longitude - 128.16) * 1000) % 80 + 10;
    const y = ((point.latitude - 37.12) * 1000) % 60 + 10;
    
    return `
      <div class="monitoring-point status-${point.status}" 
           data-point-id="${point.id}"
           style="left: ${x}%; top: ${y}%;">
        ${point.id}
        <div class="point-label">${point.name}</div>
      </div>
    `;
  }).join('');
}

// 경보 단계 렌더링
function renderAlertLevels() {
  elements.alertLevels.innerHTML = appData.alertLevels.map(level => {
    const isActive = getCurrentAlertLevel() === level.level;
    return `
      <div class="alert-level ${isActive ? 'active' : ''}" style="color: ${level.color};">
        <div class="alert-indicator" style="background-color: ${level.color};"></div>
        <div class="alert-level-info">
          <div class="alert-level-name">${level.level}</div>
          <div class="alert-level-threshold">${level.threshold}</div>
          <div class="alert-level-actions">${level.actions.join(', ')}</div>
        </div>
      </div>
    `;
  }).join('');
}

// 현재 경보 단계 계산
function getCurrentAlertLevel() {
  const maxWaterLevel = Math.max(...appData.monitoringPoints.map(p => p.waterLevel));
  if (maxWaterLevel <= 25) return '관심';
  if (maxWaterLevel <= 50) return '주의';
  if (maxWaterLevel <= 75) return '경계';
  return '심각';
}

// 시스템 구성요소 렌더링
function renderSystemComponents() {
  elements.componentsGrid.innerHTML = appData.systemComponents.map(component => `
    <div class="component-item">
      <div class="component-info">
        <div class="component-name">${component.name}</div>
        <div class="component-count">${component.count}개 설치</div>
      </div>
      <div class="component-status ${component.status}">${component.status}</div>
    </div>
  `).join('');
}

// 수위 차트 초기화
function initWaterLevelChart() {
  const ctx = document.getElementById('waterLevelChart').getContext('2d');
  
  waterLevelChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: generateTimeLabels(),
      datasets: appData.monitoringPoints.map((point, index) => ({
        label: point.name,
        data: generateWaterLevelData(point.waterLevel),
        borderColor: getChartColors()[index % getChartColors().length],
        backgroundColor: getChartColors()[index % getChartColors().length] + '20',
        fill: false,
        tension: 0.1
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false
        },
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 20,
            color: '#f5f5f5'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#a7a9a9'
          },
          grid: {
            color: 'rgba(167, 169, 169, 0.1)'
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: '#a7a9a9',
            callback: function(value) {
              return value + '%';
            }
          },
          grid: {
            color: 'rgba(167, 169, 169, 0.1)'
          }
        }
      }
    }
  });
}

// 차트 색상 배열
function getChartColors() {
  return ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'];
}

// 시간 라벨 생성
function generateTimeLabels() {
  const labels = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000);
    labels.push(time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
  }
  return labels;
}

// 수위 데이터 생성
function generateWaterLevelData(currentLevel) {
  const data = [];
  for (let i = 0; i < 12; i++) {
    const variation = (Math.random() - 0.5) * 10;
    data.push(Math.max(0, Math.min(100, currentLevel + variation)));
  }
  return data;
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 모니터링 지점 클릭
  elements.mapContainer.addEventListener('click', (e) => {
    const point = e.target.closest('.monitoring-point');
    if (point) {
      const pointId = parseInt(point.dataset.pointId);
      showPointDetails(pointId);
    }
  });

  // 필터 변경
  elements.statusFilter.addEventListener('change', (e) => {
    renderMonitoringPoints(e.target.value);
  });

  // 모달 닫기
  elements.modalClose.addEventListener('click', hideModal);
  elements.detailModal.addEventListener('click', (e) => {
    if (e.target === elements.detailModal || e.target.className === 'modal-overlay') {
      hideModal();
    }
  });

  // 데이터 내보내기
  elements.exportBtn.addEventListener('click', exportData);

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideModal();
    }
  });
}

// 지점 상세 정보 표시
function showPointDetails(pointId) {
  const point = appData.monitoringPoints.find(p => p.id === pointId);
  if (!point) return;

  elements.modalTitle.textContent = `${point.name} 상세 정보`;
  elements.modalBody.innerHTML = `
    <div class="detail-grid">
      <div class="detail-section">
        <h4>기본 정보</h4>
        <div class="detail-item">
          <span class="detail-label">지점명</span>
          <span class="detail-value">${point.name}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">유형</span>
          <span class="detail-value">${point.type}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">현재 상태</span>
          <span class="detail-value status--${point.status.toLowerCase()}">${point.status}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">수위</span>
          <span class="detail-value">${point.waterLevel}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">마지막 업데이트</span>
          <span class="detail-value">${point.lastUpdate}</span>
        </div>
      </div>
      <div class="detail-section">
        <h4>센서 상태</h4>
        <div class="detail-item">
          <span class="detail-label">수위 센서</span>
          <span class="detail-value">${point.sensors.waterSensor}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">CCTV</span>
          <span class="detail-value">${point.sensors.cctv}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">차단기</span>
          <span class="detail-value">${point.sensors.barrier}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">전광판</span>
          <span class="detail-value">${point.sensors.display}</span>
        </div>
      </div>
    </div>
  `;
  
  elements.detailModal.classList.remove('hidden');
}

// 모달 숨기기
function hideModal() {
  elements.detailModal.classList.add('hidden');
}

// 알림 토스트 표시
function showAlert(message) {
  elements.toastMessage.textContent = message;
  elements.alertToast.classList.remove('hidden');
  
  setTimeout(() => {
    elements.alertToast.classList.add('hidden');
  }, 5000);
}

// 데이터 내보내기
function exportData() {
  const data = {
    timestamp: new Date().toISOString(),
    monitoringPoints: appData.monitoringPoints,
    systemInfo: appData.systemInfo,
    statistics: appData.statistics
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jecheon-flood-monitoring-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showAlert('데이터가 성공적으로 내보내졌습니다.');
}

// 실시간 데이터 업데이트 시작
function startDataUpdates() {
  updateInterval = setInterval(() => {
    updateTime();
    simulateDataChanges();
    updateChart();
    renderAlertLevels();
  }, 5000);
}

// 데이터 변경 시뮬레이션
function simulateDataChanges() {
  appData.monitoringPoints.forEach(point => {
    // 수위 변화 시뮬레이션 (±5% 범위)
    const change = (Math.random() - 0.5) * 10;
    point.waterLevel = Math.max(0, Math.min(100, point.waterLevel + change));
    
    // 상태 업데이트
    if (point.waterLevel <= 25) point.status = '정상';
    else if (point.waterLevel <= 50) point.status = '주의';
    else if (point.waterLevel <= 75) point.status = '경계';
    else point.status = '심각';
    
    // 마지막 업데이트 시간 갱신
    point.lastUpdate = new Date().toLocaleString('ko-KR');
  });
  
  // 필터가 적용되지 않았을 때만 지점들을 다시 렌더링
  if (elements.statusFilter.value === 'all') {
    renderMonitoringPoints();
  }
}

// 차트 업데이트
function updateChart() {
  if (waterLevelChart) {
    // 새로운 데이터 포인트 추가
    waterLevelChart.data.labels.push(new Date().toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }));
    
    // 오래된 데이터 포인트 제거
    if (waterLevelChart.data.labels.length > 12) {
      waterLevelChart.data.labels.shift();
    }
    
    // 각 데이터셋 업데이트
    waterLevelChart.data.datasets.forEach((dataset, index) => {
      dataset.data.push(appData.monitoringPoints[index].waterLevel);
      if (dataset.data.length > 12) {
        dataset.data.shift();
      }
    });
    
    waterLevelChart.update('none');
  }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});