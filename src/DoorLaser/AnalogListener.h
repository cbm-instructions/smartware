#ifndef __ANALOGLISTENER__
#define __ANALOGLISTENER__

#include "InputListener.h"

class AnalogListener : public InputListener {
public:
    AnalogListener(uint8_t p_Port, uint16_t p_TriggeredAbove, uint16_t p_TriggeredBelow) 
      : InputListener(p_Port), m_TriggeredAbove(p_TriggeredAbove), m_TriggeredBelow(p_TriggeredBelow), m_LastValue(0), m_CurrentValue(0) { }

    void Update();
    bool IsTriggered();
    bool WasTriggered();
protected:
    uint16_t m_LastValue, m_CurrentValue;
    uint16_t m_TriggeredAbove, m_TriggeredBelow;
};

void AnalogListener::Update() {
  m_LastValue = m_CurrentValue;
  m_CurrentValue = analogRead(m_Port);
  InputListener::Update();
  Serial.print("A: ");
  Serial.println(m_CurrentValue);
}

bool AnalogListener::IsTriggered() {
  return m_CurrentValue >= m_TriggeredAbove && m_CurrentValue <= m_TriggeredBelow;
}

bool AnalogListener::WasTriggered() {
  return m_LastValue >= m_TriggeredAbove && m_LastValue <= m_TriggeredBelow;
}

#endif
