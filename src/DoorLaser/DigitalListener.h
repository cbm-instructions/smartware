#ifndef __DIGITALLISTENER__
#define __DIGITALLISTENER__

#include "InputListener.h"

class DigitalListener : public InputListener {
public:
    DigitalListener(uint8_t p_Port, uint8_t p_TriggeredOn) 
      : InputListener(p_Port), m_TriggeredOn(p_TriggeredOn), m_LastValue(LOW), m_CurrentValue(LOW) { }

    void Update();
    bool IsTriggered();
    bool WasTriggered();
protected:
    uint8_t m_TriggeredOn;
    uint8_t m_LastValue, m_CurrentValue;
};

void DigitalListener::Update() {
  m_LastValue = m_CurrentValue;
  m_CurrentValue = digitalRead(m_Port);
  InputListener::Update();
  Serial.print("D: ");
  Serial.println(m_CurrentValue);
}

bool DigitalListener::IsTriggered() {
  return m_CurrentValue == m_TriggeredOn;
}

bool DigitalListener::WasTriggered() {
  return m_LastValue == m_TriggeredOn;
}

#endif
