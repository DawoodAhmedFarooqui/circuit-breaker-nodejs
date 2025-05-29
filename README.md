# PROBLEM STATEMENT

## Requirements Analysis - Create UML Diagrams

### Context
Your task is to analyze the requirements for a laboratory automation system designed to integrate and automate various hardware devices within a research laboratory. Below is the description provided by the stakeholders:

### Description
The laboratory conducts experiments using a variety of specialized devices such as pipettes, centrifuges, and robotic arms. The team wants a system that can connect these devices into a cohesive workflow. Scientists need to design and execute experiment protocols where multiple devices work together seamlessly. For example, a protocol might involve dispensing liquids using pipettes, running samples in a centrifuge, and then transferring them to another device using a robotic arm.

The system should help manage the devices by discovering them on the network and registering them. Users should be able to remotely monitor device status, configure settings, and control operations. Technicians need the ability to perform device maintenance and calibration via the system.

To ensure reliability, the system must handle errors robustly. If a device fails or a workflow step encounters an issue, users should be notified immediately, and logs should record the incident. Additionally, scientists need to access these logs to troubleshoot problems and ensure compliance with laboratory standards.

Another important aspect is data management. Devices generate significant amounts of data during experiments, which must be securely stored and made available for further analysis. The system should maintain an audit trail of all activities to meet regulatory requirements.

The laboratory team also mentioned the need for various roles within the system. Scientists primarily design and execute experiments, technicians are responsible for maintenance, and administrators manage user access, roles, and system configurations.

Finally, the laboratory would like the system to generate reports on device usage, experiment outcomes, and error logs. These reports should help improve efficiency and track the laboratory's operations over time.

### Instructions
1. Analyze the above description and identify the key requirements.
2. Create:
   - A **Use Case Diagram** that captures the interactions between users, devices, and the system.
   - A **Class Diagram** that models the structure of the system, including key components, attributes, and relationships.
3. Prepare a brief explanation of your design, detailing how your diagrams address the requirements.

### Hints
- Focus on capturing the requirements of the system rather than designing the solution.
- Remember, a use case diagram illustrates the relationships between actors and their interactions with the system. It does not depict the logic or internal workings of those interactions.

---

## Coding Challenge - Implement a Circuit Breaker

### Context
In a laboratory automation system, reliable communication with hardware devices is critical. However, devices may occasionally become unavailable due to network issues, maintenance, or other reasons. To ensure system stability, you must implement a circuit breaker mechanism to protect the system from repeatedly attempting to communicate with malfunctioning devices.

### Description
A circuit breaker monitors function calls for failures and prevents further calls when a failure threshold is reached. It has three states:

1. **Closed**: All calls are executed normally. If a certain number of consecutive failures occur, the circuit breaker transitions to the Open state.
2. **Open**: The circuit breaker blocks all calls to the protected function, immediately throwing an error instead. After a specified timeout, it transitions to the Half-Open state.
3. **Half-Open**: The circuit breaker allows a limited number of calls to test if the device has recovered. If a call succeeds, it transitions back to the Closed state. If a call fails, it transitions back to the Open state.

### Instructions
Implement a `CircuitBreaker` class to protect a function that communicates with a laboratory device. The protected function simulates device communication and may throw an error if the device is unavailable. You may use **pseudocode**, **TypeScript**, or **Python** for your solution.

Here is a pseudocode example of how the `CircuitBreaker` class will be used:

```plaintext
# Simulates device communication
METHOD SimulateDeviceCommunication:
    IF random error occurs THEN
        RAISE Device not responding
    ELSE
        PRINT Device communication successful
    ENDIF

# Simulates a client interacting with the CircuitBreaker
METHOD client:
    INIT CircuitBreaker WITH SimulateDeviceCommunication

    FOR a few times
    BEGIN
        CALL CircuitBreaker.fire
        EXCEPTION
            PRINT The exception message
    ENDFOR