import confetti from 'canvas-confetti';

// Trigger celebration confetti for QA completion
confetti({
  particleCount: 200,
  spread: 100,
  origin: { y: 0.6 },
  colors: ['#FFD700', '#169873', '#14213D', '#FFFFFF']
});

console.log('🎉 COMPLIANCE QA TESTS COMPLETED SUCCESSFULLY! 🎉');