import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button, type ButtonProps } from "../../src/components/ui/button/button";

afterEach(cleanup);

const variants = ["primary", "secondary", "ghost"] as const;
const blockedStates = [
  { name: "비활성", disabled: true, loading: false },
  { name: "로딩", disabled: false, loading: true },
  { name: "로딩과 비활성", disabled: true, loading: true },
];

// DS-FR-003~005: 스타일이 달라도 조작·차단·복구 계약은 같다.
describe.each(variants)("Button 동작 — %s", (variant) => {
  it("Tab으로 접근하고 Enter·Space·클릭 한 번마다 전달한 함수를 한 번 실행한다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button variant={variant} onClick={onClick}>다시 시도</Button>);
    const button = screen.getByRole("button", { name: "다시 시도" });

    await user.tab();
    expect(document.activeElement).toBe(button);
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it.each(blockedStates)("$name 상태는 입력·제출·Tab 접근을 막고, 해제하면 복구된다", async ({ disabled, loading }) => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn();
    function example(isDisabled: boolean, isLoading: boolean) {
      return (
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <Button variant={variant} type="submit" disabled={isDisabled} loading={isLoading} onClick={onClick}>
            다시 시도
          </Button>
          <button type="button">다음 작업</button>
        </form>
      );
    }
    const view = render(example(false, false));
    const button = screen.getByRole<HTMLButtonElement>("button", { name: "다시 시도" });
    await user.tab();
    expect(document.activeElement).toBe(button);

    // 이미 포커스된 뒤 상태가 바뀌는 경우도 추가 실행을 차단해야 한다.
    view.rerender(example(disabled, loading));
    expect(button.disabled).toBe(true);
    await user.keyboard("{Enter} ");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();

    button.blur();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "다음 작업" }));

    view.rerender(example(false, false));
    const recovered = screen.getByRole<HTMLButtonElement>("button", { name: "다시 시도" });
    expect(recovered.disabled).toBe(false);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(recovered);
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("로딩과 비활성이 함께 있으면 처리 중을 표시하고, 로딩만 끝나도 비활성은 유지한다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const view = render(<Button variant={variant} loading disabled onClick={onClick}>다시 시도</Button>);
    const loadingButton = screen.getByRole<HTMLButtonElement>("button", { name: "다시 시도 처리 중…" });
    expect(loadingButton.textContent).toBe("처리 중…");
    expect(loadingButton.disabled).toBe(true);

    view.rerender(<Button variant={variant} loading={false} disabled onClick={onClick}>다시 시도</Button>);
    const disabledButton = screen.getByRole<HTMLButtonElement>("button", { name: "다시 시도" });
    expect(disabledButton.textContent).toBe("다시 시도");
    expect(disabledButton.disabled).toBe(true);
    await user.click(disabledButton);
    expect(onClick).not.toHaveBeenCalled();

    view.rerender(<Button variant={variant} onClick={onClick}>다시 시도</Button>);
    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("부모의 loading 변경에 따라 문구·접근 가능한 이름·처리 중 알림을 갱신한다", () => {
    const view = render(<Button variant={variant}>다시 시도</Button>);
    const liveRegion = view.container.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion?.textContent).toBe("");

    view.rerender(<Button variant={variant} loading>다시 시도</Button>);
    const button = screen.getByRole("button", { name: "다시 시도 처리 중…", busy: true });
    expect(button.textContent).toBe("처리 중…");
    expect(button.contains(liveRegion)).toBe(false);
    expect(liveRegion?.getAttribute("aria-atomic")).toBe("true");
    expect(liveRegion?.textContent).toBe("다시 시도 처리 중…");

    view.rerender(<Button variant={variant}>다시 시도</Button>);
    const recovered = screen.getByRole("button", { name: "다시 시도" });
    expect(recovered.getAttribute("aria-busy")).not.toBe("true");
    expect(liveRegion?.textContent).toBe("");
  });
});

describe("Button의 폼 동작과 책임 경계", () => {
  const formCases: { name: string; type?: ButtonProps["type"]; submits: number; resets: number }[] = [
    { name: "type 생략", submits: 0, resets: 0 },
    { name: "명시적 submit", type: "submit", submits: 1, resets: 0 },
    { name: "명시적 reset", type: "reset", submits: 0, resets: 1 },
  ];

  it.each(formCases)("$name — 지정한 폼 동작만 수행한다", async ({ type, submits, resets }) => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn();
    const onReset = vi.fn();
    render(
      <form
        onSubmit={(event) => { event.preventDefault(); onSubmit(); }}
        onReset={onReset}
      >
        <Button type={type} onClick={onClick}>실행</Button>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "실행" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(submits);
    expect(onReset).toHaveBeenCalledTimes(resets);
  });

  it("onClick이 Promise를 반환해도 스스로 로딩 상태로 전환하지 않는다", async () => {
    const user = userEvent.setup();
    let complete!: () => void;
    const pending = new Promise<void>((resolve) => { complete = resolve; });
    const onClick = vi.fn(() => pending);
    render(<Button onClick={onClick}>다시 시도</Button>);
    const button = screen.getByRole<HTMLButtonElement>("button", { name: "다시 시도" });

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe("다시 시도");
    expect(button.getAttribute("aria-busy")).not.toBe("true");
    await act(async () => { complete(); await pending; });
    expect(screen.getByRole("button", { name: "다시 시도" })).toBe(button);
  });
});
