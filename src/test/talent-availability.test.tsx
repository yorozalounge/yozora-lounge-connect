import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TalentAvailability from "@/components/talent-profile/TalentAvailability";

const Harness = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <>
      <TalentAvailability
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onSelectDate={setSelectedDate}
        onSelectTime={setSelectedTime}
      />
      <div data-testid="selected-time">{selectedTime ?? "none"}</div>
    </>
  );
};

describe("TalentAvailability", () => {
  it("selects a time slot when clicked", () => {
    render(<Harness />);

    const dateButton = screen
      .getAllByRole("button")
      .find((button) => /^\d+$/.test(button.textContent ?? "") && !button.hasAttribute("disabled"));

    expect(dateButton).toBeDefined();

    fireEvent.click(dateButton!);

    const timeButton = screen
      .getAllByRole("button")
      .find((button) => /(AM|PM)/.test(button.textContent ?? ""));

    expect(timeButton).toBeDefined();

    fireEvent.click(timeButton!);

    expect(screen.getByTestId("selected-time")).not.toHaveTextContent("none");
  });
});