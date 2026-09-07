/**
 * LetsTestTools.dev — Interactive Frontend Script
 * Industrial Property Fuzzing Simulation, Code Tabs, and Micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initInstallSwitcher();
  initCodeTabs();
  initSimulator();
});

/* 1. Quick Install Switcher & Clipboard Copy */
function initInstallSwitcher() {
  const tabs = document.querySelectorAll('.install-tab');
  const codeEl = document.getElementById('install-code-snippet');
  const copyBtn = document.getElementById('copy-install-btn');

  const commands = {
    'dart-cmd': 'dart pub add dev:hegeltest',
    'flutter-cmd': 'flutter pub add dev:hegeltest_flutter'
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      if (commands[target]) {
        codeEl.textContent = commands[target];
      }
    });
  });

  if (copyBtn && codeEl) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeEl.textContent.trim());
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`;
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
        }, 2000);
      } catch (e) {
        console.error('Clipboard copy failed:', e);
      }
    });
  }
}

/* 2. Code Editor Tabs */
function initCodeTabs() {
  const tabs = document.querySelectorAll('.editor-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* 3. Interactive Fuzzing & Shrinking Engine Simulator */
function initSimulator() {
  const consoleEl = document.getElementById('simulator-console');
  const runBtn = document.getElementById('run-sim-btn');
  const resetBtn = document.getElementById('reset-sim-btn');
  const statusEl = document.getElementById('sim-status');
  const casesEl = document.getElementById('sim-cases');
  const reductionEl = document.getElementById('sim-reduction');
  const coverageEl = document.getElementById('sim-coverage');

  let isRunning = false;
  let timeoutIds = [];

  const clearAllTimeouts = () => {
    timeoutIds.forEach(id => clearTimeout(id));
    timeoutIds = [];
  };

  const log = (text, className = '') => {
    const line = document.createElement('div');
    line.className = `log-line ${className}`;
    line.innerHTML = text;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  };

  const resetSimulation = () => {
    clearAllTimeouts();
    isRunning = false;
    consoleEl.innerHTML = `
      <div class="log-line text-muted">// Property under test: forall (List&lt;int&gt; xs) => xs.sum &gt;= 0</div>
      <div class="log-line text-muted">// Ready to start. Click "Run Property Fuzz" to initiate the engine.</div>
    `;
    statusEl.textContent = 'IDLE';
    statusEl.className = 'sim-stat-value';
    casesEl.textContent = '0 / 100';
    reductionEl.textContent = 'NONE';
    if (coverageEl) {
      coverageEl.textContent = 'READY';
      coverageEl.className = 'sim-stat-value';
    }
    runBtn.disabled = false;
    runBtn.textContent = '▶ Run Property Fuzz';
  };

  const runSimulation = () => {
    if (isRunning) return;
    isRunning = true;
    runBtn.disabled = true;
    runBtn.textContent = 'Running...';
    consoleEl.innerHTML = '';
    
    statusEl.textContent = 'PHASE.GENERATE';
    statusEl.className = 'sim-stat-value text-sky';
    casesEl.textContent = '0 / 100';
    reductionEl.textContent = 'NONE';
    if (coverageEl) {
      coverageEl.textContent = 'TRACKING...';
      coverageEl.className = 'sim-stat-value text-amber';
    }

    log('<span class="log-step">[hegeltest]</span> Initializing native fuzzing engine (libhegel_c)...', 'text-muted');
    log('<span class="log-step">[hegeltest]</span> Running Phase.generate with seed=0x7F2A9C01...', 'text-muted');
    log('<span class="log-coverage">[tc.cover]</span> Contract registered: "negative_sums" >= 20.0% coverage required', 'text-muted');

    // Step 1: Passing cases
    const passingSteps = [
      { delay: 300, cases: '12 / 100', cov: '25.0% (3/12)', text: '<span class="log-pass">✓</span> [draw #12] xs = [14, 98, 2, 45] -> sum: 159 (Passed)' },
      { delay: 700, cases: '27 / 100', cov: '29.6% (8/27)', text: '<span class="log-pass">✓</span> [draw #27] xs = [0, 891, 102] -> sum: 993 (Passed)' },
      { delay: 1100, cases: '39 / 100', cov: '33.3% (13/39)', text: '<span class="log-pass">✓</span> [draw #39] xs = [49, 12, 8] -> sum: 69 (Passed)' },
      { delay: 1500, cases: '47 / 100', cov: '34.0% (MET)', text: '<span class="log-fail">✗</span> [draw #47] xs = [812, 19, -942, 12, 55, -4] -> sum: -48 (FAILED)' }
    ];

    passingSteps.forEach(s => {
      timeoutIds.push(setTimeout(() => {
        casesEl.textContent = s.cases;
        if (coverageEl) {
          coverageEl.textContent = s.cov;
          if (s.cov.includes('MET')) {
            coverageEl.className = 'sim-stat-value text-emerald';
          }
        }
        log(s.text);
      }, s.delay));
    });

    // Step 2: Shrinking phase
    timeoutIds.push(setTimeout(() => {
      statusEl.textContent = 'PHASE.SHRINK';
      statusEl.className = 'sim-stat-value text-amber';
      log('<br><span class="log-shrink">── Entering Shrink Phase (Binary AST Reduction) ──</span>');
      log('Initial failure candidate length: 6 elements, sum = -48');
    }, 1900));

    const shrinkSteps = [
      { delay: 2400, red: '33%', text: '<span class="log-shrink">▸ Shrink step 1:</span> [812, 19, -942, 12] (length 4, sum -99) -> Still fails' },
      { delay: 2900, red: '66%', text: '<span class="log-shrink">▸ Shrink step 2:</span> [-942, 12] (length 2, sum -930) -> Still fails' },
      { delay: 3400, red: '83%', text: '<span class="log-shrink">▸ Shrink step 3:</span> [-942] (length 1, sum -942) -> Still fails' },
      { delay: 3900, red: '98%', text: '<span class="log-shrink">▸ Shrink step 4:</span> [-1] (minimal single-element counterexample found!)' }
    ];

    shrinkSteps.forEach(s => {
      timeoutIds.push(setTimeout(() => {
        reductionEl.textContent = s.red;
        log(s.text);
      }, s.delay));
    });

    // Step 3: Persistence to .hegel/ & Coverage Check
    timeoutIds.push(setTimeout(() => {
      statusEl.textContent = 'PHASE.PERSIST';
      statusEl.className = 'sim-stat-value text-emerald';
      reductionEl.textContent = '[-1]';
      log('<br><span class="log-db">💾 [database]</span> Hashed minimal counterexample -> SHA256: 4e9f82a1');
      log('<span class="log-db">💾 [database]</span> Saved reproduction blob to <code>.hegel/examples/4e9f82a1.blob</code>');
      log('<span class="log-db">💾 [database]</span> Ensured <code>.hegel/.gitignore</code> exists (clean git status).');
      log('<span class="log-coverage">📊 [tc.cover]</span> Target "negative_sums": observed 34.0% &gt;= 20.0% required &rarr; Contract passed');
      log('<span class="log-coverage">📊 [tc.classify]</span> Distribution: 55% positive, 34% negative, 11% zero');
      log('<br><span class="log-pass">✔ [DONE]</span> On next test run (local dev or CI), known counterexample <strong>[-1]</strong> will replay on <strong>iteration 1</strong> before random fuzzing begins!');
      
      statusEl.textContent = 'CACHED (REPLAY READY)';
      runBtn.textContent = '▶ Run Again';
      runBtn.disabled = false;
      isRunning = false;
    }, 4500));
  };

  if (runBtn) runBtn.addEventListener('click', runSimulation);
  if (resetBtn) resetBtn.addEventListener('click', resetSimulation);
}
