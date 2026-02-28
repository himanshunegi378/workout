To build a useful fatigue meter, the goal is to translate subjective exertion and raw workout data into a quantifiable metric that warns users before they overtrain.

Since you are building this into an application, you need an algorithm that relies on the data points a user already logs—specifically volume, RPE (Rate of Perceived Exertion), and frequency—rather than requiring them to take external medical measurements like heart rate variability (HRV).

Here is a breakdown of how the logic for a fatigue meter should work, moving from the fitness science concepts to the application logic.

### 1. The Core Concept: Why simple counters fail

A basic "days worked out in a row" counter is a poor fatigue meter. Five days of light mobility work is fundamentally different from five days of heavy compound lifting.

* **The "Why":** Central nervous system (CNS) fatigue is non-linear. It compounds based on intensity, not just time. To calculate true fatigue, the application must weigh *how hard* the work was, not just *that* the work happened. This is usually done by calculating a "Session Load."

### 2. The Algorithm: Calculating Session Load (Cause → Effect)

To build the meter, your application needs to calculate a daily stress score. A common and highly effective method used in sports science is the **sRPE (Session RPE) Load**, or a **Volume-Load** calculation.

* **Step 1: Calculate the Daily Load (The Cause)**
For each workout, multiply the total volume (or total session duration in minutes) by the RPE provided by the user.
* *Formula:* `Daily Load = Total Workout Volume × (RPE / 10)`
* *Example:* If a user moves 5,000kg of total volume at an RPE of 8, their load score is 4,000.


* **Step 2: Calculate the Acute vs. Chronic Workload Ratio (The Effect)**
A single hard workout doesn't cause chronic fatigue; a string of them does. Your application should track two rolling averages:
* **Acute Load:** The average Daily Load over the last 7 days (representing immediate fatigue).
* **Chronic Load:** The average Daily Load over the last 28 days (representing overall fitness and work capacity).
* *The Mechanism:* Divide the Acute Load by the Chronic Load.
* **Cause → Effect:** If the acute load suddenly spikes to be 1.5x higher than the chronic load (cause), the user's body is absorbing stress faster than it is accustomed to recovering, spiking the fatigue meter into the "red zone" and increasing injury risk (effect).



### 3. Application UI States: Visualizing the Meter

You can map the resulting ratio (ACWR) to a clean UI component (like a gauge or a progress bar) with three distinct states:

* **Green / Optimal (Ratio 0.8 to 1.3):** The user is accumulating enough stress to force physical adaptation, but recovering adequately.
* **Yellow / Warning (Ratio 1.3 to 1.5):** The user is overreaching. The application should suggest dropping the RPE targets or reducing the number of working sets for the next session.
* **Red / Danger (Ratio > 1.5):** Systemic fatigue is high. The application should recommend a strict rest day or a deload week to allow the CNS to recover.

---

### ⚠️ Risks and Limitations of an Algorithmic Fatigue Meter

* **The Subjectivity of RPE:** The entire algorithm hinges on the user accurately logging their RPE. If a user ego-lifts and logs an RPE 7 when it was actually an RPE 10, the application will falsely report that they are fully recovered, potentially leading to injury.
* **Missing External Stressors:** The application only knows about gym stress. It cannot factor in a user getting four hours of sleep, experiencing high stress at work, or eating in a caloric deficit. The meter might show "Green," but the user's biological reality is "Red."
* **Algorithmic Rigidity:** Hardcoding a strict 7-day/28-day window might not fit everyone's biological recovery rate. Advanced lifters recover differently than beginners.