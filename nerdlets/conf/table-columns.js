const TableColumns = [
    {
      filter: "filter(average(cpuPercent), WHERE apmApplicationNames IS NOT NULL) AS 'container_cpu'",
      title: "Container CPU (Avg)%",
      reference: "container_cpu",
      formatter: (value) => Math.round(value * 100) / 100,
      source: "ProcessSample",
      enabled: true,
      applicability: "containerId"
    },
    {
      filter: "filter(average(cpuPercent), WHERE apmApplicationNames IS NOT NULL) AS 'host_cpu'",
      title: "Host CPU (Avg)%",
      reference: "host_cpu",
      formatter: (value) => Math.round(value * 100) / 100,
      source: "SystemSample",
      enabled: true,
      applicability: "entityName"
    },
    {
      filter: "filter(average(memoryResidentSizeBytes), WHERE apmApplicationNames IS NOT NULL) AS 'container_memory'",
      title: "Container Memory (Avg)%",
      reference: "container_memory",
      formatter: (value) => (value / 1048576).toFixed(2),
      source: "ProcessSample",
      enabled: true,
      applicability: "containerId"
    },
    {
      filter: "filter(average(memoryUsedBytes), WHERE apmApplicationNames IS NOT NULL)  AS 'host_memory'",
      title: "Host Memory (Avg)%",
      reference: "host_memory",
      formatter: (value) => (value / 1048576).toFixed(2),
      source: "SystemSample",
      enabled: true,
      applicability: "entityName"
    },
    {
      filter: "filter(latest(containerLabel_io.kubernetes.pod.name), WHERE apmApplicationNames IS NOT NULL) AS 'podname'",
      title: "Podname",
      reference: "podname",
      formatter: (value) => value,
      source: "ProcessSample",
      enabled: true,
      applicability: "containerId"
    },
    {
      filter: "filter(rate(count(*), 1 minute), WHERE appName IS NOT NULL) AS 'txnrt'",
      title: "TXN RPM",
      reference: "txnrt",
      formatter: (value) => Math.round(value * 100) / 100,
      source: "Transaction",
      enabled: true, 
      applicability: "any"
    },
    {
      filter: "filter(count(*), WHERE appName IS NOT NULL) AS 'txn'",
      title: "TXN Count",
      reference: "txn",
      formatter: (value) => value,
      source: "Transaction",
      enabled: true, 
      applicability: "any"
    },    
    {
      filter: "filter(percentile(duration, 50), WHERE appName IS NOT NULL) AS 'txn_50_percentile'",
      title: "50TH %LE (S)",
      reference: "txn_50_percentile[50]",
      formatter: (value) => Math.round(value * 10000) / 10000,
      source: "Transaction",
      enabled: true, 
      applicability: "any"
    },
    {
      filter: "filter(percentile(duration, 90), WHERE appName IS NOT NULL) AS 'txn_90_percentile'",
      title: "90TH %LE (S)",
      reference: "txn_90_percentile[90]",
      formatter: (value) => Math.round(value * 10000) / 10000,
      source: "Transaction",
      enabled: true, 
      applicability: "any"
    },
    {
      filter: "filter(rate(count(*), 1 minute), WHERE error.class IS NOT NULL) AS 'errrt'",
      title: "ERROR RPM",
      reference: "errrt",
      formatter: (value) => Math.round(value * 100) / 100,
      source: "TransactionError",
      enabled: true, 
      applicability: "any"
    },
    {
      filter: "filter(count(*), WHERE error.class IS NOT NULL) AS 'err'",
      title: "ERR Count",
      reference: "err",
      formatter: (value) => value,
      source: "TransactionError",
      enabled: true, 
      applicability: "any"
    }
  ]
  export default TableColumns