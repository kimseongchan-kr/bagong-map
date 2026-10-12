import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "../../src/components/ui/badge/badge";

afterEach(cleanup);

describe("DS2-05 Badge", () => {
 it.each([["recruiting", "모집 중"], ["pending", "승인 대기"], ["approved", "참여 승인"], ["closed", "모집 마감"]] as const)("Badge %s 문구를 표시한다", (status, label) => {
  render(<Badge status={status} />); expect(screen.getByText(label)).toBeDefined();
 });
});
