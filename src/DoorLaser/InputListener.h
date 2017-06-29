#ifndef __INPUTLISTENER__
#define __INPUTLISTENER__

class InputListener {
public:
    InputListener(uint8_t p_Port) : m_Port(p_Port) { }

    virtual void Update() {
      if (Triggered())
        m_CountTriggered++;
    }
    virtual bool IsTriggered() = 0;
    virtual bool WasTriggered() = 0;
    virtual bool Triggered() {
      return IsTriggered() && !WasTriggered();
    }
    virtual bool Released() {
      return !IsTriggered() && !WasTriggered();
    }

    uint32_t GetCountTriggered() {
      return m_CountTriggered;
    }

    void Reset() {
      m_CountTriggered = 0;
    }
protected:
    uint8_t m_Port;
    uint32_t m_CountTriggered;
};
#endif
