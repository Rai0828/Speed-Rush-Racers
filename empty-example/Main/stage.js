function updateStage() {
  if (stage < stageGoals.length - 1 && distance >= stageGoals[stage]) {
    stage++;
    stageMessageTimer = 120;
  }

  if (stageMessageTimer > 0) stageMessageTimer--;
}
