import { useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import TableWithContextMenu from "../../../../Components/Common/TableWithContextMenu";
import { router, usePage } from "@inertiajs/react";
import { Badge, Button, Col, Spinner } from "react-bootstrap";

const RecentUpload = () => {
  const { t } = useTranslation();
  const { importHistory } = usePage().props as any;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [canRefresh, setCanRefresh] = useState(true);

  const fetchData = useCallback(
    (importPage: number = 1, importPerPage: number = 10, filters?: any) => {
      router.reload({
        only: ["importHistory", "subProduct"],
        replace: true,
        data: {
          importPage,
          importPerPage,
          ...filters,
        },
        onFinish: () => {
          setIsRefreshing(false);
        },
      });
    },
    []
  );

  const handleRefreshClick = useCallback(() => {
    const now = Date.now();
    //second
    if (now - lastRefreshTime < 2000) {
      return;
    }

    setIsRefreshing(true);
    setCanRefresh(false);
    setLastRefreshTime(now);
    
    const startTime = Date.now();
    
    router.reload({
      only: ["importHistory", "accounts", "subProduct"],
      replace: true,
      onFinish: () => {
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 1000;
        
        if (elapsedTime < minLoadingTime) {
          setTimeout(() => {
            setIsRefreshing(false);
          }, minLoadingTime - elapsedTime);
        } else {
          setIsRefreshing(false);
        }
        
        setTimeout(() => {
          setCanRefresh(true);
        }, 2000);
      },
    });
  }, [lastRefreshTime]);


  const columns = useMemo(
    () => [
      {
        header: t("File name"),
        accessorKey: "file_path",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return <span>{cell.getValue().split("/").pop()}</span>;
        },
      },
      {
        header: t("Upload date"),
        accessorKey: "created_at",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          return (
            <span>{moment(cell.getValue()).format("DD/MM/YYYY HH:mm")}</span>
          );
        },
      },
      {
        header: t("Status"),
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const status = cell.getValue() || "Unknown";
          const statusLabel = {
            FINISH: t("Finish"),
            RUNNING: t("Processing"),
            ERROR: t("Error"),
            Unknown: t("Unknown"),
          } as any;

          const className = {
            FINISH: "bg-success",
            RUNNING: "bg-info",
            ERROR: "bg-danger",
            Unknown: "bg-dark",
          } as any;

          return (
            <span
              className={`badge ${
                className?.[status] || "bg-dark"
              } fs-6 fw-medium`}
            >
              {t(statusLabel?.[status] || "Unknown")}
            </span>
          );
        },
      },
      {
        header: t("Result"),
        accessorKey: "result",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => {
          const result = cell.getValue() || {};
          const isSuccess = cell?.row?.original?.status === "FINISH";
          if (!isSuccess) {
            return null;
          }
          return (
            <div>
              <Badge bg="secondary">
                {t("Total")}: {result?.total_count || 0}
              </Badge>{" "}
              <Badge bg="success">
                {t("Success")}: {result?.success_count || 0}
              </Badge>{" "}
              <Badge bg="danger">
                {t("Error")}: {result?.error_count || 0}
              </Badge>
            </div>
          );
        },
      },
    ],
    [t]
  );

  return (
    <>
      <Col lg={12} className="mb-4 d-flex align-items-center gap-2">
        <h5>{t("Recent uploaded files")}</h5>
        <Button 
          variant="outline-info"
          onClick={handleRefreshClick}
          disabled={isRefreshing || !canRefresh}
          style={{
            transition: 'all 0.3s ease-in-out',
            opacity: (isRefreshing || !canRefresh) ? 0.6 : 1
          }}
        >
          {isRefreshing && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
          )}
          {t("Refresh")}
        </Button>
      </Col>
      <Col lg={12}>
        <div>
          <TableWithContextMenu
            columns={columns}
            data={importHistory || []}
            divClass="table-responsive table-card mb-3"
            tableClass="table align-middle table-nowrap mb-0"
            theadClass="table-light"
            enableContextMenu={false}
            isPaginateTable={true}
            onReloadTable={fetchData}
            keyPageParam="importPage"
            keyPerPageParam="importPerPage"
          />
        </div>
      </Col>
    </>
  );
};
export default RecentUpload;
