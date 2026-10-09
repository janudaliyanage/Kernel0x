import { userStore } from "../db/store.js"

const STAGE_CONFIG = {
  stage1: {
    points: 150,
    validAnswers: ["K0X-17", "KERNEL0X{K0X-17}"],
    successMessage: `STAGE 1 SOLVED — THE FIRST LEAD CONFIRMED\n\nYou successfully identified the hidden deployment clue.\n\nClue recovered: K0X-17\n\nThis clue is required for the next stage.\n\nStage 2 — Hidden in Plain Sight has been unlocked.`,
    clue: "K0X-17",
  },
  stage2: {
    points: 150,
    validAnswers: ["Rlyuls0E{jhlzhy_pz_jshzzpj}"],
    successMessage: `STAGE 2 SOLVED — HIDDEN DATA RECOVERED\n\nThe image contained a concealed message.\n\nHowever, the recovered text is encrypted and cannot yet be understood.\n\nRecovered ciphertext:\n\nRlyuls0E{jhlzhy_pz_jshzzpj}\n\nThe message appears to use a simple classical cipher.\n\nStage 3 — The Encrypted Note has been unlocked.`,
    ciphertext: "Rlyuls0E{jhlzhy_pz_jshzzpj}",
  },
  stage3: {
    points: 150,
    validAnswers: ["Kernel0X{caesar_is_classic}"],
    successMessage: `STAGE 3 SOLVED — THE ENCRYPTED NOTE HAS BEEN DECODED\n\nThe encrypted note has been successfully decoded.\n\nFlag recovered:\n\nKernel0X{caesar_is_classic}\n\nThe investigation now moves from hidden files and encrypted messages to the network evidence left behind by the attacker.\n\nContinue to Stage 4 — The Exfiltration Trail.`,
    flag: "Kernel0X{caesar_is_classic}",
  },
  stage4: {
    points: 150,
    validAnswers: [
      "OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}|MLECE6_YSZH=mlece6|JXHUY6_HVKTFGVZ=MKL|OTRKL6_IMWVJADI=r0l_ihinaksy|GNSKA6_PRWZKIJH=Jeoe@2026!",
    ],
    successMessage: `STAGE 4 SOLVED — THE EXFILTRATION TRAIL CONFIRMED\n\nYou successfully reconstructed the suspicious FTP transfer and recovered the encrypted message from the network evidence.\n\nThe FTP control traffic also revealed an important hostname clue.\n\nThe recovered ciphertext has been passed to the next stage.\n\nStage 5 — The Second Cipher has been unlocked.`,
  },
  stage5: {
    points: 150,
    validAnswers: ["Kernel0X{warehouse9_vigenere}"],
    successMessage: `STAGE 5 SOLVED — THE SECOND CIPHER DECODED\n\nThe encrypted message has been successfully decrypted.\n\nThe investigation has revealed the next stage of the attacker's operation.\n\nThe credentials required to access the live investigation environment have also been recovered.\n\nStage 6 — Kernel0X's Final Message has been unlocked.`,
    flag: "Kernel0X{warehouse9_vigenere}",
  },
  stage6: {
    points: 200,
    validAnswers: ["Kernel0X{dead_drop_recovered}"],
    successMessage: `KERNEL0X — INVESTIGATION COMPLETE\n\nYou successfully reconstructed the final stage of the breach.\n\nYou recovered the Stage 6 dead-drop image, identified the hidden data, decoded the first cryptographic layer, and used the recovered key to decrypt the second layer.\n\nFinal Flag: Kernel0X{dead_drop_recovered}`,
    flag: "Kernel0X{dead_drop_recovered}",
  },
}

// ---- Time-based XP scoring ----
// Each stage awards BASE_XP plus a speed bonus that decays linearly to 0
// over DECAY_SECONDS (measured from when the stage became available).
const STAGE_ORDER = ["stage1", "stage2", "stage3", "stage4", "stage5", "stage6"]
const BASE_XP = 100
const BONUS_XP = 100
const DECAY_SECONDS = 60 * 60
const SCORING = { baseXp: BASE_XP, bonusXp: BONUS_XP, decaySeconds: DECAY_SECONDS }

function calcXp(seconds) {
  const s = Math.max(0, seconds)
  return BASE_XP + Math.round(Math.max(0, BONUS_XP * (1 - s / DECAY_SECONDS)))
}

function formatDuration(seconds) {
  const s = Math.max(0, Math.round(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = n => String(n).padStart(2, "0")
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

function currentStageOf(solvedStages) {
  return STAGE_ORDER.find(s => !solvedStages.includes(s)) || null
}

export async function getProgress(req, res) {
  try {
    const user = await userStore.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const solvedStages = user.solvedStages || []
    let stageTimes = user.stageTimes || {}

    // Start the clock for the active stage the first time it is seen
    const current = currentStageOf(solvedStages)
    if (current && !stageTimes[current]?.startedAt) {
      const idx = STAGE_ORDER.indexOf(current)
      const prev = idx > 0 ? stageTimes[STAGE_ORDER[idx - 1]] : null
      stageTimes = {
        ...stageTimes,
        [current]: { ...(stageTimes[current] || {}), startedAt: prev?.solvedAt || new Date().toISOString() },
      }
      await userStore.updateUser(user.id, { stageTimes })
    }

    return res.json({
      success: true,
      solvedStages,
      points: user.points || 0,
      stageTimes,
      currentStage: current,
      currentStageStartedAt: current ? stageTimes[current]?.startedAt : null,
      scoring: SCORING,
      stage4Ciphertext: solvedStages.includes("stage4")
        ? STAGE_CONFIG.stage4.validAnswers[0]
        : undefined,
    })
  } catch (err) {
    console.error("[getProgress Error]", err)
    return res.status(500).json({ success: false, message: "Error fetching CTF progress" })
  }
}

export async function submitFlag(req, res) {
  try {
    const { stage, flag } = req.body
    if (!stage || !flag) {
      return res.status(400).json({ success: false, message: "Stage and flag answer are required." })
    }

    const stageConfig = STAGE_CONFIG[stage]
    if (!stageConfig) {
      return res.status(400).json({ success: false, message: "Invalid stage specified." })
    }

    const user = await userStore.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const solvedStages = user.solvedStages || []

    // Ensure sequential progression
    if (stage === "stage2" && !solvedStages.includes("stage1")) {
      return res.status(403).json({
        success: false,
        message: "Stage 2 is locked. Complete Stage 1 first.",
      })
    }
    if (stage === "stage3" && !solvedStages.includes("stage2")) {
      return res.status(403).json({
        success: false,
        message: "Stage 3 is locked. Complete Stage 2 first.",
      })
    }
    if (stage === "stage4" && !solvedStages.includes("stage3")) {
      return res.status(403).json({
        success: false,
        message: "Stage 4 is locked. Complete Stage 3 first.",
      })
    }
    if (stage === "stage5" && !solvedStages.includes("stage4")) {
      return res.status(403).json({
        success: false,
        message: "Stage 5 is locked. Complete Stage 4 first.",
      })
    }
    if (stage === "stage6" && !solvedStages.includes("stage5")) {
      return res.status(403).json({
        success: false,
        message: "Stage 6 is locked. Complete Stage 5 first.",
      })
    }

    if (solvedStages.includes(stage)) {
      return res.json({
        success: true,
        alreadySolved: true,
        message: "This stage has already been solved by your operative.",
        solvedStages,
        points: user.points || 0,
        ciphertext: stage === "stage4" ? STAGE_CONFIG.stage4.validAnswers[0] : undefined,
      })
    }

    const cleanedFlag = flag.trim()
    const isCorrect = stageConfig.validAnswers.some(
      ans => ans === cleanedFlag || ans.toUpperCase() === cleanedFlag.toUpperCase()
    )

    if (!isCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect. Follow the evidence and try again.",
      })
    }

    // Correct flag! Award time-based XP
    const now = new Date()
    const stageTimes = { ...(user.stageTimes || {}) }
    const startedAt = stageTimes[stage]?.startedAt || now.toISOString()
    const seconds = Math.max(0, (now.getTime() - new Date(startedAt).getTime()) / 1000)
    const xp = calcXp(seconds)

    stageTimes[stage] = { startedAt, solvedAt: now.toISOString(), seconds: Math.round(seconds), xp }
    // Start the clock for the next stage
    const nextStage = STAGE_ORDER[STAGE_ORDER.indexOf(stage) + 1]
    if (nextStage && !stageTimes[nextStage]?.startedAt) {
      stageTimes[nextStage] = { startedAt: now.toISOString() }
    }

    const newSolvedStages = [...solvedStages, stage]
    const newPoints = (user.points || 0) + xp

    await userStore.updateUser(user.id, {
      solvedStages: newSolvedStages,
      points: newPoints,
      stageTimes,
      lastSolvedAt: now.toISOString(),
    })

    return res.json({
      success: true,
      message: `${stageConfig.successMessage}\n\nXP EARNED: +${xp} XP (solved in ${formatDuration(seconds)})`,
      solvedStages: newSolvedStages,
      points: newPoints,
      xpEarned: xp,
      secondsTaken: Math.round(seconds),
      stageTimes,
      currentStage: currentStageOf(newSolvedStages),
      currentStageStartedAt: nextStage ? stageTimes[nextStage]?.startedAt : null,
      ciphertext: stage === "stage4" ? cleanedFlag : undefined,
    })
  } catch (err) {
    console.error("[submitFlag Error]", err)
    return res.status(500).json({ success: false, message: "Internal server error submitting flag." })
  }
}

export async function resetProgress(req, res) {
  try {
    const user = await userStore.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const { stage } = req.body || {}
    if (stage && STAGE_ORDER.includes(stage)) {
      const targetIndex = STAGE_ORDER.indexOf(stage)
      const stagesToKeep = STAGE_ORDER.slice(0, targetIndex)
      const newSolvedStages = (user.solvedStages || []).filter(s => stagesToKeep.includes(s))

      const newStageTimes = {}
      let newPoints = 0
      for (const s of newSolvedStages) {
        if (user.stageTimes && user.stageTimes[s]) {
          newStageTimes[s] = user.stageTimes[s]
          newPoints += user.stageTimes[s].xp || STAGE_CONFIG[s]?.points || 150
        } else {
          newPoints += STAGE_CONFIG[s]?.points || 150
        }
      }

      const now = new Date().toISOString()
      newStageTimes[stage] = { startedAt: now }

      await userStore.updateUser(user.id, {
        solvedStages: newSolvedStages,
        points: newPoints,
        stageTimes: newStageTimes,
        lastSolvedAt: newSolvedStages.length > 0 ? user.lastSolvedAt : null,
      })

      return res.json({
        success: true,
        message: `${stage.toUpperCase()} progress reset. You can now re-test this stage.`,
        solvedStages: newSolvedStages,
        points: newPoints,
        currentStage: stage,
        currentStageStartedAt: now,
      })
    }

    const now = new Date().toISOString()
    await userStore.updateUser(user.id, {
      solvedStages: [],
      points: 0,
      stageTimes: { stage1: { startedAt: now } },
      lastSolvedAt: null,
    })

    return res.json({
      success: true,
      message: "Operative progress reset.",
      solvedStages: [],
      points: 0,
      currentStage: "stage1",
      currentStageStartedAt: now,
    })
  } catch (err) {
    console.error("[resetProgress Error]", err)
    return res.status(500).json({ success: false, message: "Error resetting progress" })
  }
}

export async function getLeaderboard(req, res) {
  try {
    const users = await userStore.getAllUsers()

    const list = users
      .filter(u => u.username)
      .map(u => {
        const solved = (u.solvedStages || []).filter(s => STAGE_ORDER.includes(s))
        const totalSeconds = solved.reduce((sum, s) => sum + (u.stageTimes?.[s]?.seconds || 0), 0)
        return {
          id: u.id,
          username: u.username,
          teamName: u.teamName || "",
          points: u.points || 0,
          solvedCount: solved.length,
          totalSeconds,
          lastSolvedAt: u.lastSolvedAt || null,
        }
      })

    // Rank: most XP first; tie -> less total time; tie -> earliest last solve
    list.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (a.totalSeconds !== b.totalSeconds) return a.totalSeconds - b.totalSeconds
      return (a.lastSolvedAt || "9").localeCompare(b.lastSolvedAt || "9")
    })

    const ranked = list.map((u, i) => ({ ...u, rank: i + 1, isYou: u.id === req.user?.id }))

    return res.json({
      success: true,
      total: ranked.length,
      leaderboard: ranked.slice(0, 50),
      you: ranked.find(u => u.isYou) || null,
      serverTime: new Date().toISOString(),
    })
  } catch (err) {
    console.error("[getLeaderboard Error]", err)
    return res.status(500).json({ success: false, message: "Error fetching leaderboard" })
  }
}

