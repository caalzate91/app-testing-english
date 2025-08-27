import { renderHook, act } from "@testing-library/react";
import { useQuiz } from "../useQuiz";

describe("useQuiz Edge Cases", () => {
  it("should handle empty questions", () => {
    const { result } = renderHook(() => useQuiz({ questions: [] }));
    expect(result.current.currentQuestion).toBeNull();
  });
});
